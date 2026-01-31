import { Inject, Injectable, Logger } from '@nestjs/common';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentMethod } from '../../domain/enums';
import {
  IPaymentRepository,
  PAYMENT_REPOSITORY,
} from '../../domain/repositories/payment.repository.interface';
import {
  IPaymentGateway,
  PAYMENT_GATEWAY,
} from '../../domain/services/payment-gateway.interface';
import {
  TemporalClient,
  TEMPORAL_CLIENT,
} from '../../infrastructure/temporal/temporal.client';
import {
  creditCardPaymentWorkflow,
  getPaymentStateQuery,
} from '../../infrastructure/temporal/workflows/payment.workflow';
import { CreatePaymentDto, PaymentResponseDto } from '../dtos';

@Injectable()
export class CreatePaymentUseCase {
  private readonly logger = new Logger(CreatePaymentUseCase.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: IPaymentGateway,
    @Inject(TEMPORAL_CLIENT)
    private readonly temporalClient: TemporalClient,
  ) {}

  async execute(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    if (dto.paymentMethod === PaymentMethod.CREDIT_CARD) {
      return this.handleCreditCardPayment(dto);
    }

    return this.handlePixPayment(dto);
  }

  private async handlePixPayment(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const payment = new Payment({
      cpf: dto.cpf,
      description: dto.description,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
    });

    const savedPayment = await this.paymentRepository.create(payment);
    return PaymentResponseDto.fromEntity(savedPayment);
  }

  private async handleCreditCardPayment(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    this.logger.log('Starting credit card payment workflow');

    const client = await this.temporalClient.getClient();
    const taskQueue = this.temporalClient.getTaskQueue();
    const timeoutMinutes = this.temporalClient.getPaymentTimeoutMinutes();

    const workflowId = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const handle = await client.workflow.start(creditCardPaymentWorkflow, {
      taskQueue,
      workflowId,
      args: [
        {
          cpf: dto.cpf,
          description: dto.description,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
        },
        timeoutMinutes,
      ],
    });

    this.logger.log(`Workflow started with ID: ${workflowId}`);

    // Poll for the workflow to reach 'waiting_payment' status
    // This means the payment and preference have been created
    let state = await handle.query(getPaymentStateQuery);
    let attempts = 0;
    const maxAttempts = 30;

    while (state.status === 'initializing' && attempts < maxAttempts) {
      await this.delay(500);
      state = await handle.query(getPaymentStateQuery);
      attempts++;
    }

    if (!state.payment || !state.preference) {
      throw new Error('Failed to create payment workflow');
    }

    const payment = new Payment({
      id: state.payment.id,
      cpf: state.payment.cpf,
      description: state.payment.description,
      amount: state.payment.amount,
      paymentMethod: state.payment.paymentMethod,
      status: state.payment.status,
      externalId: state.payment.externalId,
      createdAt: new Date(state.payment.createdAt),
      updatedAt: new Date(state.payment.updatedAt),
    });

    return PaymentResponseDto.fromEntity(payment, state.preference.initPoint);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
