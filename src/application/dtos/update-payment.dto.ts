import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from '../../domain/enums';

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus, {
    message: 'Status deve ser PENDING, PAID ou FAIL',
  })
  status?: PaymentStatus;
}
