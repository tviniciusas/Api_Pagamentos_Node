import { CreatePaymentDto, FilterPaymentDto, PaymentResponseDto, UpdatePaymentDto } from '../../application/dtos';
import { CreatePaymentUseCase, FindAllPaymentsUseCase, FindPaymentByIdUseCase, UpdatePaymentUseCase } from '../../application/use-cases';
export declare class PaymentController {
    private readonly createPaymentUseCase;
    private readonly updatePaymentUseCase;
    private readonly findPaymentByIdUseCase;
    private readonly findAllPaymentsUseCase;
    constructor(createPaymentUseCase: CreatePaymentUseCase, updatePaymentUseCase: UpdatePaymentUseCase, findPaymentByIdUseCase: FindPaymentByIdUseCase, findAllPaymentsUseCase: FindAllPaymentsUseCase);
    create(dto: CreatePaymentDto): Promise<PaymentResponseDto>;
    update(id: string, dto: UpdatePaymentDto): Promise<PaymentResponseDto>;
    findById(id: string): Promise<PaymentResponseDto>;
    findAll(filters: FilterPaymentDto): Promise<PaymentResponseDto[]>;
}
