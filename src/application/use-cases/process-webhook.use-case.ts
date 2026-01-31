import { Inject, Injectable, Logger } from '@nestjs/common';
import { PaymentMethod, PaymentStatus } from '../../domain/enums';
import {
  IPaymentRepository,
  PAYMENT_REPOSITORY,
} from '../../domain/repositories/payment.repository.interface';
import {
  TemporalClient,
  TEMPORAL_CLIENT,
} from '../../infrastructure/temporal/temporal.client';
import { paymentWebhookSignal } from '../../infrastructure/temporal/workflows/payment.workflow';
import { MercadoPagoWebhookDto } from '../dtos';

@Injectable()
export class ProcessWebhookUseCase {
  private readonly logger = new Logger(ProcessWebhookUseCase.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(TEMPORAL_CLIENT)
    private readonly temporalClient: TemporalClient,
  ) {}

  async execute(webhookData: MercadoPagoWebhookDto): Promise<void> {
    this.logger.log(`Recebido webhook do Mercado Pago: ${JSON.stringify(webhookData)}`);

    if (webhookData.type !== 'payment') {
      this.logger.log(`Tipo de webhook ignorado: ${webhookData.type}`);
      return;
    }

    const externalId = webhookData.data?.id;
    if (!externalId) {
      this.logger.warn('Webhook sem ID de pagamento externo');
      return;
    }

    const payment = await this.paymentRepository.findByExternalId(externalId);
    if (!payment) {
      this.logger.warn(`Pagamento não encontrado para externalId: ${externalId}`);
      return;
    }

    // For credit card payments, signal the workflow
    if (payment.paymentMethod === PaymentMethod.CREDIT_CARD) {
      await this.signalWorkflow(payment.id, webhookData.action || '', externalId);
    } else {
      // For PIX payments, update directly
      const newStatus = this.mapWebhookActionToStatus(webhookData.action);
      if (newStatus) {
        payment.updateStatus(newStatus);
        await this.paymentRepository.update(payment);
        this.logger.log(`Pagamento ${payment.id} atualizado para status: ${newStatus}`);
      }
    }
  }

  private async signalWorkflow(
    paymentId: string,
    action: string,
    externalPaymentId: string,
  ): Promise<void> {
    try {
      const client = await this.temporalClient.getClient();

      // Find running workflows
      const workflows = client.workflow.list({
        query: `ExecutionStatus = "Running"`,
      });

      for await (const workflow of workflows) {
        if (workflow.workflowId.startsWith('payment-')) {
          try {
            const handle = client.workflow.getHandle(workflow.workflowId);
            await handle.signal(paymentWebhookSignal, {
              action,
              externalPaymentId,
            });
            this.logger.log(`Workflow ${workflow.workflowId} sinalizado com ação: ${action}`);
            return;
          } catch (error) {
            this.logger.debug(`Workflow ${workflow.workflowId} não corresponde ao pagamento`);
            continue;
          }
        }
      }

      this.logger.warn(`Nenhum workflow ativo encontrado para pagamento: ${paymentId}`);

      // Fallback: update payment directly if no workflow found
      const paymentToUpdate = await this.paymentRepository.findById(paymentId);
      if (paymentToUpdate) {
        const newStatus = this.mapWebhookActionToStatus(action);
        if (newStatus) {
          paymentToUpdate.updateStatus(newStatus);
          await this.paymentRepository.update(paymentToUpdate);
          this.logger.log(`Pagamento ${paymentId} atualizado diretamente para: ${newStatus}`);
        }
      }
    } catch (error) {
      this.logger.error(`Erro ao sinalizar workflow: ${error.message}`, error.stack);
      throw error;
    }
  }

  private mapWebhookActionToStatus(action?: string): PaymentStatus | null {
    switch (action) {
      case 'payment.approved':
        return PaymentStatus.PAID;
      case 'payment.rejected':
      case 'payment.cancelled':
        return PaymentStatus.FAIL;
      default:
        return null;
    }
  }
}
