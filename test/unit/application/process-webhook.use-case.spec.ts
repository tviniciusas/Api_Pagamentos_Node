import { ProcessWebhookUseCase } from '../../../src/application/use-cases/process-webhook.use-case';
import { MercadoPagoWebhookDto } from '../../../src/application/dtos';
import { Payment } from '../../../src/domain/entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '../../../src/domain/enums';
import { IPaymentRepository } from '../../../src/domain/repositories/payment.repository.interface';

describe('ProcessWebhookUseCase', () => {
  let useCase: ProcessWebhookUseCase;
  let mockPaymentRepository: jest.Mocked<IPaymentRepository>;

  beforeEach(() => {
    mockPaymentRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByExternalId: jest.fn(),
    };

    useCase = new ProcessWebhookUseCase(mockPaymentRepository);
  });

  describe('execute', () => {
    it('should update payment status to PAID when action is payment.approved', async () => {
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

      mockPaymentRepository.findByExternalId.mockResolvedValue(payment);
      mockPaymentRepository.update.mockResolvedValue(payment);

      await useCase.execute(webhookData);

      expect(mockPaymentRepository.findByExternalId).toHaveBeenCalledWith(externalId);
      expect(mockPaymentRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should update payment status to FAIL when action is payment.rejected', async () => {
      const externalId = 'external-123';
      const webhookData: MercadoPagoWebhookDto = {
        type: 'payment',
        action: 'payment.rejected',
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

      mockPaymentRepository.findByExternalId.mockResolvedValue(payment);
      mockPaymentRepository.update.mockResolvedValue(payment);

      await useCase.execute(webhookData);

      expect(mockPaymentRepository.findByExternalId).toHaveBeenCalledWith(externalId);
      expect(mockPaymentRepository.update).toHaveBeenCalledTimes(1);
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
    });
  });
});
