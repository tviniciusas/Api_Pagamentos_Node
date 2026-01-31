import { CreatePaymentUseCase } from '../../../src/application/use-cases/create-payment.use-case';
import { CreatePaymentDto } from '../../../src/application/dtos';
import { Payment } from '../../../src/domain/entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '../../../src/domain/enums';
import { IPaymentRepository } from '../../../src/domain/repositories/payment.repository.interface';
import { IPaymentGateway } from '../../../src/domain/services/payment-gateway.interface';

describe('CreatePaymentUseCase', () => {
  let useCase: CreatePaymentUseCase;
  let mockPaymentRepository: jest.Mocked<IPaymentRepository>;
  let mockPaymentGateway: jest.Mocked<IPaymentGateway>;

  beforeEach(() => {
    mockPaymentRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByExternalId: jest.fn(),
    };

    mockPaymentGateway = {
      createPreference: jest.fn(),
    };

    useCase = new CreatePaymentUseCase(mockPaymentRepository, mockPaymentGateway);
  });

  describe('execute', () => {
    it('should create a PIX payment without calling payment gateway', async () => {
      const dto: CreatePaymentDto = {
        cpf: '12345678901',
        description: 'Test PIX payment',
        amount: 100.0,
        paymentMethod: PaymentMethod.PIX,
      };

      const savedPayment = new Payment({
        id: 'payment-id',
        ...dto,
        status: PaymentStatus.PENDING,
      });

      mockPaymentRepository.create.mockResolvedValue(savedPayment);

      const result = await useCase.execute(dto);

      expect(mockPaymentRepository.create).toHaveBeenCalledTimes(1);
      expect(mockPaymentGateway.createPreference).not.toHaveBeenCalled();
      expect(result.id).toBe('payment-id');
      expect(result.status).toBe(PaymentStatus.PENDING);
      expect(result.paymentMethod).toBe(PaymentMethod.PIX);
    });

    it('should create a CREDIT_CARD payment and call payment gateway', async () => {
      const dto: CreatePaymentDto = {
        cpf: '12345678901',
        description: 'Test Credit Card payment',
        amount: 200.0,
        paymentMethod: PaymentMethod.CREDIT_CARD,
      };

      const savedPayment = new Payment({
        id: 'payment-id',
        ...dto,
        status: PaymentStatus.PENDING,
      });

      const preferenceResponse = {
        preferenceId: 'preference-123',
        initPoint: 'https://mercadopago.com/checkout/preference-123',
      };

      mockPaymentRepository.create.mockResolvedValue(savedPayment);
      mockPaymentGateway.createPreference.mockResolvedValue(preferenceResponse);
      mockPaymentRepository.update.mockResolvedValue(savedPayment);

      const result = await useCase.execute(dto);

      expect(mockPaymentRepository.create).toHaveBeenCalledTimes(1);
      expect(mockPaymentGateway.createPreference).toHaveBeenCalledWith(savedPayment);
      expect(mockPaymentRepository.update).toHaveBeenCalledTimes(1);
      expect(result.initPoint).toBe(preferenceResponse.initPoint);
    });
  });
});
