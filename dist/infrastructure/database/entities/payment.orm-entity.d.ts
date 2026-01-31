import { PaymentMethod, PaymentStatus } from '../../../domain/enums';
export declare class PaymentOrmEntity {
    id: string;
    cpf: string;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    externalId?: string;
    createdAt: Date;
    updatedAt: Date;
}
