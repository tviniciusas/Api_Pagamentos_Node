import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../../../src/presentation/controllers/payment.controller';
import {
  CreatePaymentUseCase,
  UpdatePaymentUseCase,
  FindPaymentByIdUseCase,
  FindAllPaymentsUseCase,
} from '../../../src/application/use-cases';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  FilterPaymentDto,
  PaymentResponseDto,
} from '../../../src/application/dtos';
import { PaymentMethod, PaymentStatus } from '../../../src/domain/enums';

describe('PaymentController', () => {
  let controller: PaymentController;
  let createPaymentUseCase: jest.Mocked<CreatePaymentUseCase>;
  let updatePaymentUseCase: jest.Mocked<UpdatePaymentUseCase>;
  let findPaymentByIdUseCase: jest.Mocked<FindPaymentByIdUseCase>;
  let findAllPaymentsUseCase: jest.Mocked<FindAllPaymentsUseCase>;

  beforeEach(async () => {
    const mockCreatePaymentUseCase = {
      execute: jest.fn(),
    };

    const mockUpdatePaymentUseCase = {
      execute: jest.fn(),
    };

    const mockFindPaymentByIdUseCase = {
      execute: jest.fn(),
    };

    const mockFindAllPaymentsUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        { provide: CreatePaymentUseCase, useValue: mockCreatePaymentUseCase },
        { provide: UpdatePaymentUseCase, useValue: mockUpdatePaymentUseCase },
        { provide: FindPaymentByIdUseCase, useValue: mockFindPaymentByIdUseCase },
        { provide: FindAllPaymentsUseCase, useValue: mockFindAllPaymentsUseCase },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    createPaymentUseCase = module.get(CreatePaymentUseCase);
    updatePaymentUseCase = module.get(UpdatePaymentUseCase);
    findPaymentByIdUseCase = module.get(FindPaymentByIdUseCase);
    findAllPaymentsUseCase = module.get(FindAllPaymentsUseCase);
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const dto: CreatePaymentDto = {
        cpf: '12345678901',
        description: 'Test payment',
        amount: 100.0,
        paymentMethod: PaymentMethod.PIX,
      };

      const expectedResponse: PaymentResponseDto = {
        id: 'payment-id',
        cpf: dto.cpf,
        description: dto.description,
        amount: dto.amount,
        paymentMethod: dto.paymentMethod,
        status: PaymentStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      createPaymentUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await controller.create(dto);

      expect(createPaymentUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('update', () => {
    it('should update a payment', async () => {
      const id = 'payment-id';
      const dto: UpdatePaymentDto = {
        status: PaymentStatus.PAID,
      };

      const expectedResponse: PaymentResponseDto = {
        id,
        cpf: '12345678901',
        description: 'Test payment',
        amount: 100.0,
        paymentMethod: PaymentMethod.PIX,
        status: PaymentStatus.PAID,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      updatePaymentUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await controller.update(id, dto);

      expect(updatePaymentUseCase.execute).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findById', () => {
    it('should return a payment by id', async () => {
      const id = 'payment-id';

      const expectedResponse: PaymentResponseDto = {
        id,
        cpf: '12345678901',
        description: 'Test payment',
        amount: 100.0,
        paymentMethod: PaymentMethod.PIX,
        status: PaymentStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      findPaymentByIdUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await controller.findById(id);

      expect(findPaymentByIdUseCase.execute).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      const filters: FilterPaymentDto = {};

      const expectedResponse: PaymentResponseDto[] = [
        {
          id: 'payment-1',
          cpf: '12345678901',
          description: 'Payment 1',
          amount: 100.0,
          paymentMethod: PaymentMethod.PIX,
          status: PaymentStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      findAllPaymentsUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(filters);

      expect(findAllPaymentsUseCase.execute).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expectedResponse);
    });

    it('should filter payments by CPF', async () => {
      const filters: FilterPaymentDto = { cpf: '12345678901' };

      const expectedResponse: PaymentResponseDto[] = [
        {
          id: 'payment-1',
          cpf: '12345678901',
          description: 'Payment 1',
          amount: 100.0,
          paymentMethod: PaymentMethod.PIX,
          status: PaymentStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      findAllPaymentsUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(filters);

      expect(findAllPaymentsUseCase.execute).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expectedResponse);
    });
  });
});
