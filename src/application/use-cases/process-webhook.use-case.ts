import { Inject, Injectable, Logger } from '@nestjs/common';
import { PaymentStatus } from '../../domain/enums';
import {
  IPaymentRepository,
  PAYMENT_REPOSITORY,
} from '../../domain/repositories/payment.repository.interface';
import { MercadoPagoWebhookDto } from '../dtos';

@Injectable()
export class ProcessWebhookUseCase {
  private readonly logger = new Logger(ProcessWebhookUseCase.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
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

    const newStatus = this.mapWebhookActionToStatus(webhookData.action);
    if (newStatus) {
      payment.updateStatus(newStatus);
      await this.paymentRepository.update(payment);
      this.logger.log(`Pagamento ${payment.id} atualizado para status: ${newStatus}`);
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
