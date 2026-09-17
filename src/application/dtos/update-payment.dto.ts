import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from '../../domain/enums';

export class UpdatePaymentDto {
  @ApiPropertyOptional({
    description: 'Novo status do pagamento',
    enum: PaymentStatus,
    example: PaymentStatus.PAID,
  })
  @IsOptional()
  @IsEnum(PaymentStatus, {
    message: 'Status deve ser PENDING, PAID ou FAIL',
  })
  status?: PaymentStatus;
}
