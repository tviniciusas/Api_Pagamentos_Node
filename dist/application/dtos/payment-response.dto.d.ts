import { Payment } from '../../domain/entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '../../domain/enums';
export declare class PaymentResponseDto {
    id: string;
    cpf: string;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    initPoint?: string;
    createdAt: Date;
    updatedAt: Date;
    static fromEntity(payment: Payment, initPoint?: string): PaymentResponseDto;
}
