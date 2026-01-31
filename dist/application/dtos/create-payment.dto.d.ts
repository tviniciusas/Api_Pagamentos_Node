import { PaymentMethod } from '../../domain/enums';
export declare class CreatePaymentDto {
    cpf: string;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
}
