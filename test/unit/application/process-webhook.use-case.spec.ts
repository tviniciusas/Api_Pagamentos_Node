import { ProcessWebhookUseCase } from '../../../src/application/use-cases/process-webhook.use-case';
import { MercadoPagoWebhookDto } from '../../../src/application/dtos';
import { Payment } from '../../../src/domain/entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '../../../src/domain/enums';
import { IPaymentRepository } from '../../../src/domain/repositories/payment.repository.interface';
import { TemporalClient } from '../../../src/infrastructure/temporal/temporal.client';

describe('ProcessWebhookUseCase', () => {
  let useCase: ProcessWebhookUseCase;
  let mockPaymentRepository: jest.Mocked<IPaymentRepository>;
  let mockTemporalClient: jest.Mocked<TemporalClient>;

  beforeEach(() => {
    mockPaymentRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByExternalId: jest.fn(),
    };

    mockTemporalClient = {
      getClient: jest.fn(),
      getTaskQueue: jest.fn().mockReturnValue('payment-queue'),
      getPaymentTimeoutMinutes: jest.fn().mockReturnValue(30),
      onModuleDestroy: jest.fn(),
    } as unknown as jest.Mocked<TemporalClient>;

    useCase = new ProcessWebhookUseCase(mockPaymentRepository, mockTemporalClient);
  });

  describe('execute', () => {
    it('should signal workflow when CREDIT_CARD payment receives webhook', async () => {
      const externalId = 'external-123';
      const webhookData: MercadoPagoWebhookDto = {
        type: 'payment',
        action: 'payment.approved',
        data: { id: externalId },
      };

      const payment = new Payment({
        id: 'payment-id',
        cpf: '12345678901',
        description: 'Test payment',
        amount: 100.0,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.PENDING,
        externalId,
      });

      const mockWorkflowHandle = {
        signal: jest.fn().mockResolvedValue(undefined),
      };

      const mockWorkflowIterator = {
        [Symbol.asyncIterator]: async function* () {
          yield { workflowId: 'payment-123' };
        },
      };

      const mockClient = {
        workflow: {
          list: jest.fn().mockReturnValue(mockWorkflowIterator),
          getHandle: jest.fn().mockReturnValue(mockWorkflowHandle),
        },
      };

      mockPaymentRepository.findByExternalId.mockResolvedValue(payment);
      mockTemporalClient.getClient.mockResolvedValue(mockClient as any);

      await useCase.execute(webhookData);

      expect(mockPaymentRepository.findByExternalId).toHaveBeenCalledWith(externalId);
      expect(mockTemporalClient.getClient).toHaveBeenCalled();
      expect(mockWorkflowHandle.signal).toHaveBeenCalled();
    });

    it('should update PIX payment directly without using Temporal', async () => {
      const externalId = 'external-123';
      const webhookData: MercadoPagoWebhookDto = {
        type: 'payment',
        action: 'payment.approved',
        data: { id: externalId },
      };

      const payment = new Payment({
        id: 'payment-id',
        cpf: '12345678901',
        description: 'Test payment',
        amount: 100.0,
        paymentMethod: PaymentMethod.PIX,
        status: PaymentStatus.PENDING,
        externalId,
      });

      mockPaymentRepository.findByExternalId.mockResolvedValue(payment);
      mockPaymentRepository.update.mockResolvedValue(payment);

      await useCase.execute(webhookData);

      expect(mockPaymentRepository.findByExternalId).toHaveBeenCalledWith(externalId);
      expect(mockPaymentRepository.update).toHaveBeenCalledTimes(1);
      expect(mockTemporalClient.getClient).not.toHaveBeenCalled();
    });

    it('should ignore non-payment webhook types', async () => {
      const webhookData: MercadoPagoWebhookDto = {
        type: 'merchant_order',
        action: 'created',
      };

      await useCase.execute(webhookData);

      expect(mockPaymentRepository.findByExternalId).not.toHaveBeenCalled();
      expect(mockPaymentRepository.update).not.toHaveBeenCalled();
    });

    it('should not update when payment not found', async () => {
      const webhookData: MercadoPagoWebhookDto = {
        type: 'payment',
        action: 'payment.approved',
        data: { id: 'non-existent' },
      };

      mockPaymentRepository.findByExternalId.mockResolvedValue(null);

      await useCase.execute(webhookData);

      expect(mockPaymentRepository.update).not.toHaveBeenCalled();
      expect(mockTemporalClient.getClient).not.toHaveBeenCalled();
    });
  });
});
