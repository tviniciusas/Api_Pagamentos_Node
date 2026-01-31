import { FindAllPaymentsUseCase } from '../../../src/application/use-cases/find-all-payments.use-case';
import { FilterPaymentDto } from '../../../src/application/dtos';
import { Payment } from '../../../src/domain/entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '../../../src/domain/enums';
import { IPaymentRepository } from '../../../src/domain/repositories/payment.repository.interface';

describe('FindAllPaymentsUseCase', () => {
  let useCase: FindAllPaymentsUseCase;
  let mockPaymentRepository: jest.Mocked<IPaymentRepository>;

  beforeEach(() => {
    mockPaymentRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByExternalId: jest.fn(),
    };

    useCase = new FindAllPaymentsUseCase(mockPaymentRepository);
  });

  describe('execute', () => {
    it('should return all payments without filters', async () => {
      const payments = [
        new Payment({
          id: 'payment-1',
          cpf: '12345678901',
          description: 'Payment 1',
          amount: 100.0,
          paymentMethod: PaymentMethod.PIX,
          status: PaymentStatus.PENDING,
        }),
        new Payment({
          id: 'payment-2',
          cpf: '98765432109',
          description: 'Payment 2',
          amount: 200.0,
          paymentMethod: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.PAID,
        }),
      ];

      mockPaymentRepository.findAll.mockResolvedValue(payments);

      const result = await useCase.execute();

      expect(mockPaymentRepository.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toHaveLength(2);
    });

    it('should return filtered payments by CPF', async () => {
      const cpf = '12345678901';
      const filters: FilterPaymentDto = { cpf };

      const payments = [
        new Payment({
          id: 'payment-1',
          cpf,
          description: 'Payment 1',
          amount: 100.0,
          paymentMethod: PaymentMethod.PIX,
          status: PaymentStatus.PENDING,
        }),
      ];

      mockPaymentRepository.findAll.mockResolvedValue(payments);

      const result = await useCase.execute(filters);

      expect(mockPaymentRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toHaveLength(1);
      expect(result[0].cpf).toBe(cpf);
    });

    it('should return filtered payments by payment method', async () => {
      const filters: FilterPaymentDto = { paymentMethod: PaymentMethod.CREDIT_CARD };

      const payments = [
        new Payment({
          id: 'payment-2',
          cpf: '98765432109',
          description: 'Payment 2',
          amount: 200.0,
          paymentMethod: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.PAID,
        }),
      ];

      mockPaymentRepository.findAll.mockResolvedValue(payments);

      const result = await useCase.execute(filters);

      expect(mockPaymentRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toHaveLength(1);
      expect(result[0].paymentMethod).toBe(PaymentMethod.CREDIT_CARD);
    });

    it('should return empty array when no payments found', async () => {
      mockPaymentRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toHaveLength(0);
    });
  });
});
