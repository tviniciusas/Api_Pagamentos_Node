import { PaymentMethod, PaymentStatus } from '../enums';
export interface PaymentProps {
    id?: string;
    cpf: string;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
    status?: PaymentStatus;
    externalId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Payment {
    private readonly _id;
    private readonly _cpf;
    private readonly _description;
    private readonly _amount;
    private readonly _paymentMethod;
    private _status;
    private _externalId?;
    private readonly _createdAt;
    private _updatedAt;
    constructor(props: PaymentProps);
    get id(): string;
    get cpf(): string;
    get description(): string;
    get amount(): number;
    get paymentMethod(): PaymentMethod;
    get status(): PaymentStatus;
    get externalId(): string | undefined;
    get createdAt(): Date;
    get updatedAt(): Date;
    markAsPaid(): void;
    markAsFailed(): void;
    setExternalId(externalId: string): void;
    updateStatus(status: PaymentStatus): void;
    isPix(): boolean;
    isCreditCard(): boolean;
    toJSON(): PaymentProps;
}
