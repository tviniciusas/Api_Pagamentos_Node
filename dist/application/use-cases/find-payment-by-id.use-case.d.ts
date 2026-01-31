import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentResponseDto } from '../dtos';
export declare class FindPaymentByIdUseCase {
    private readonly paymentRepository;
    constructor(paymentRepository: IPaymentRepository);
    execute(id: string): Promise<PaymentResponseDto>;
}
