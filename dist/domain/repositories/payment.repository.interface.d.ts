import { Payment } from '../entities/payment.entity';
import { PaymentMethod } from '../enums';
export interface PaymentFilters {
    cpf?: string;
    paymentMethod?: PaymentMethod;
}
export interface IPaymentRepository {
    create(payment: Payment): Promise<Payment>;
    update(payment: Payment): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findAll(filters?: PaymentFilters): Promise<Payment[]>;
    findByExternalId(externalId: string): Promise<Payment | null>;
}
export declare const PAYMENT_REPOSITORY: unique symbol;
