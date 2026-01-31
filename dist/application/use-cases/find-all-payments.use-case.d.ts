import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { FilterPaymentDto, PaymentResponseDto } from '../dtos';
export declare class FindAllPaymentsUseCase {
    private readonly paymentRepository;
    constructor(paymentRepository: IPaymentRepository);
    execute(filters?: FilterPaymentDto): Promise<PaymentResponseDto[]>;
}
