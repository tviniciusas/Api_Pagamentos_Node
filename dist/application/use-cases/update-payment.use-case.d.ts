import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentResponseDto, UpdatePaymentDto } from '../dtos';
export declare class UpdatePaymentUseCase {
    private readonly paymentRepository;
    constructor(paymentRepository: IPaymentRepository);
    execute(id: string, dto: UpdatePaymentDto): Promise<PaymentResponseDto>;
}
