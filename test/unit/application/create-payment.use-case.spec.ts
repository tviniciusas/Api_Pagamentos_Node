import { CreatePaymentUseCase } from '../../../src/application/use-cases/create-payment.use-case';
import { CreatePaymentDto } from '../../../src/application/dtos';
import { Payment } from '../../../src/domain/entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '../../../src/domain/enums';
import { IPaymentRepository } from '../../../src/domain/repositories/payment.repository.interface';
import { IPaymentGateway } from '../../../src/domain/services/payment-gateway.interface';
import { TemporalClient } from '../../../src/infrastructure/temporal/temporal.client';

describe('CreatePaymentUseCase', () => {
  let useCase: CreatePaymentUseCase;
  let mockPaymentRepository: jest.Mocked<IPaymentRepository>;
  let mockPaymentGateway: jest.Mocked<IPaymentGateway>;
  let mockTemporalClient: jest.Mocked<TemporalClient>;

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

    mockTemporalClient = {
      getClient: jest.fn(),
      getTaskQueue: jest.fn().mockReturnValue('payment-queue'),
      getPaymentTimeoutMinutes: jest.fn().mockReturnValue(30),
      onModuleDestroy: jest.fn(),
    } as unknown as jest.Mocked<TemporalClient>;

    useCase = new CreatePaymentUseCase(
      mockPaymentRepository,
      mockPaymentGateway,
      mockTemporalClient,
    );
  });

  describe('execute', () => {
    it('should create a PIX payment without calling payment gateway or Temporal', async () => {
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
      expect(mockTemporalClient.getClient).not.toHaveBeenCalled();
      expect(result.id).toBe('payment-id');
      expect(result.status).toBe(PaymentStatus.PENDING);
      expect(result.paymentMethod).toBe(PaymentMethod.PIX);
    });

    it('should create a CREDIT_CARD payment using Temporal workflow', async () => {
      const dto: CreatePaymentDto = {
        cpf: '12345678901',
        description: 'Test Credit Card payment',
        amount: 200.0,
        paymentMethod: PaymentMethod.CREDIT_CARD,
      };

      const workflowState = {
        payment: {
          id: 'payment-id',
          cpf: dto.cpf,
          description: dto.description,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          status: PaymentStatus.PENDING,
          externalId: 'preference-123',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        preference: {
          preferenceId: 'preference-123',
          initPoint: 'https://mercadopago.com/checkout/preference-123',
        },
        status: 'waiting_payment',
      };

      const mockWorkflowHandle = {
        query: jest.fn().mockResolvedValue(workflowState),
      };

      const mockClient = {
        workflow: {
          start: jest.fn().mockResolvedValue(mockWorkflowHandle),
        },
      };

      mockTemporalClient.getClient.mockResolvedValue(mockClient as any);

      const result = await useCase.execute(dto);

      expect(mockTemporalClient.getClient).toHaveBeenCalled();
      expect(mockClient.workflow.start).toHaveBeenCalled();
      expect(result.initPoint).toBe(workflowState.preference.initPoint);
      expect(result.paymentMethod).toBe(PaymentMethod.CREDIT_CARD);
    });
  });
});
