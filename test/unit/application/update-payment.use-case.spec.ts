import { NotFoundException } from '@nestjs/common';
import { UpdatePaymentUseCase } from '../../../src/application/use-cases/update-payment.use-case';
import { UpdatePaymentDto } from '../../../src/application/dtos';
import { Payment } from '../../../src/domain/entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '../../../src/domain/enums';
import { IPaymentRepository } from '../../../src/domain/repositories/payment.repository.interface';

describe('UpdatePaymentUseCase', () => {
  let useCase: UpdatePaymentUseCase;
  let mockPaymentRepository: jest.Mocked<IPaymentRepository>;

  beforeEach(() => {
    mockPaymentRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByExternalId: jest.fn(),
    };

    useCase = new UpdatePaymentUseCase(mockPaymentRepository);
  });

  describe('execute', () => {
    it('should update payment status', async () => {
      const paymentId = 'payment-id';
      const dto: UpdatePaymentDto = {
        status: PaymentStatus.PAID,
      };

      const existingPayment = new Payment({
        id: paymentId,
        cpf: '12345678901',
        description: 'Test payment',
        amount: 100.0,
        paymentMethod: PaymentMethod.PIX,
        status: PaymentStatus.PENDING,
      });

      const updatedPayment = new Payment({
        ...existingPayment.toJSON(),
        status: PaymentStatus.PAID,
      });

      mockPaymentRepository.findById.mockResolvedValue(existingPayment);
      mockPaymentRepository.update.mockResolvedValue(updatedPayment);

      const result = await useCase.execute(paymentId, dto);

      expect(mockPaymentRepository.findById).toHaveBeenCalledWith(paymentId);
      expect(mockPaymentRepository.update).toHaveBeenCalledTimes(1);
      expect(result.status).toBe(PaymentStatus.PAID);
    });

    it('should throw NotFoundException when payment not found', async () => {
      const paymentId = 'non-existent-id';
      const dto: UpdatePaymentDto = {
        status: PaymentStatus.PAID,
      };

      mockPaymentRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(paymentId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
