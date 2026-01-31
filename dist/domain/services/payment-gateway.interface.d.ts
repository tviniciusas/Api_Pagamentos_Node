import { Payment } from '../entities/payment.entity';
export interface CreatePreferenceResponse {
    preferenceId: string;
    initPoint: string;
}
export interface IPaymentGateway {
    createPreference(payment: Payment): Promise<CreatePreferenceResponse>;
}
export declare const PAYMENT_GATEWAY: unique symbol;
