import { NotFoundException } from '@nestjs/common';
import { FindPaymentByIdUseCase } from '../../../src/application/use-cases/find-payment-by-id.use-case';
import { Payment } from '../../../src/domain/entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '../../../src/domain/enums';
import { IPaymentRepository } from '../../../src/domain/repositories/payment.repository.interface';

describe('FindPaymentByIdUseCase', () => {
  let useCase: FindPaymentByIdUseCase;
  let mockPaymentRepository: jest.Mocked<IPaymentRepository>;

  beforeEach(() => {
    mockPaymentRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByExternalId: jest.fn(),
    };

    useCase = new FindPaymentByIdUseCase(mockPaymentRepository);
  });

  describe('execute', () => {
    it('should return payment when found', async () => {
      const paymentId = 'payment-id';
      const payment = new Payment({
        id: paymentId,
        cpf: '12345678901',
        description: 'Test payment',
        amount: 100.0,
        paymentMethod: PaymentMethod.PIX,
        status: PaymentStatus.PENDING,
      });

      mockPaymentRepository.findById.mockResolvedValue(payment);

      const result = await useCase.execute(paymentId);

      expect(mockPaymentRepository.findById).toHaveBeenCalledWith(paymentId);
      expect(result.id).toBe(paymentId);
    });

    it('should throw NotFoundException when payment not found', async () => {
      const paymentId = 'non-existent-id';

      mockPaymentRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(paymentId)).rejects.toThrow(NotFoundException);
    });
  });
});
