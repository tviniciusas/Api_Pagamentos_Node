import { PaymentMethod, PaymentStatus } from '../../domain/enums';

export interface PaymentData {
  cpf: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface PaymentRecord {
  id: string;
  cpf: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  externalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MercadoPagoPreference {
  preferenceId: string;
  initPoint: string;
}

export interface WorkflowResult {
  payment: PaymentRecord;
  preference: MercadoPagoPreference;
}

export interface WebhookSignal {
  action: string;
  externalPaymentId: string;
}
