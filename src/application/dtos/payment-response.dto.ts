import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '../../domain/enums';

export class PaymentResponseDto {
  @ApiProperty({ format: 'uuid', example: 'c656901b-0e57-4957-8fb3-675d54d68580' })
  id: string;

  @ApiProperty({ example: '12345678901' })
  cpf: string;

  @ApiProperty({ example: 'Assinatura mensal' })
  description: string;

  @ApiProperty({ example: 100.0 })
  amount: number;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiPropertyOptional({
    description: 'URL de checkout do Mercado Pago. Presente apenas para CREDIT_CARD.',
    example: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...',
  })
  initPoint?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
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
