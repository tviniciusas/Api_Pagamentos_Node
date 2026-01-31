import { Payment } from '../../domain/entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '../../domain/enums';

export class PaymentResponseDto {
  id: string;
  cpf: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  initPoint?: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(payment: Payment, initPoint?: string): PaymentResponseDto {
    const dto = new PaymentResponseDto();
    dto.id = payment.id;
    dto.cpf = payment.cpf;
    dto.description = payment.description;
    dto.amount = payment.amount;
    dto.paymentMethod = payment.paymentMethod;
    dto.status = payment.status;
    dto.initPoint = initPoint;
    dto.createdAt = payment.createdAt;
    dto.updatedAt = payment.updatedAt;
    return dto;
  }
}
