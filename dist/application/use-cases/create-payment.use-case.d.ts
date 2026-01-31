import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { IPaymentGateway } from '../../domain/services/payment-gateway.interface';
import { CreatePaymentDto, PaymentResponseDto } from '../dtos';
export declare class CreatePaymentUseCase {
    private readonly paymentRepository;
    private readonly paymentGateway;
    constructor(paymentRepository: IPaymentRepository, paymentGateway: IPaymentGateway);
    execute(dto: CreatePaymentDto): Promise<PaymentResponseDto>;
}
