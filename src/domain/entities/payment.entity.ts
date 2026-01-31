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

export class Payment {
  private readonly _id: string;
  private readonly _cpf: string;
  private readonly _description: string;
  private readonly _amount: number;
  private readonly _paymentMethod: PaymentMethod;
  private _status: PaymentStatus;
  private _externalId?: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: PaymentProps) {
    this._id = props.id ?? '';
    this._cpf = props.cpf;
    this._description = props.description;
    this._amount = props.amount;
    this._paymentMethod = props.paymentMethod;
    this._status = props.status ?? PaymentStatus.PENDING;
    this._externalId = props.externalId;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get id(): string {
    return this._id;
  }

  get cpf(): string {
    return this._cpf;
  }

  get description(): string {
    return this._description;
  }

  get amount(): number {
    return this._amount;
  }

  get paymentMethod(): PaymentMethod {
    return this._paymentMethod;
  }

  get status(): PaymentStatus {
    return this._status;
  }

  get externalId(): string | undefined {
    return this._externalId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  markAsPaid(): void {
    this._status = PaymentStatus.PAID;
    this._updatedAt = new Date();
  }

  markAsFailed(): void {
    this._status = PaymentStatus.FAIL;
    this._updatedAt = new Date();
  }

  setExternalId(externalId: string): void {
    this._externalId = externalId;
    this._updatedAt = new Date();
  }

  updateStatus(status: PaymentStatus): void {
    this._status = status;
    this._updatedAt = new Date();
  }

  isPix(): boolean {
    return this._paymentMethod === PaymentMethod.PIX;
  }

  isCreditCard(): boolean {
    return this._paymentMethod === PaymentMethod.CREDIT_CARD;
  }

  toJSON(): PaymentProps {
    return {
      id: this._id,
      cpf: this._cpf,
      description: this._description,
      amount: this._amount,
      paymentMethod: this._paymentMethod,
      status: this._status,
      externalId: this._externalId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
