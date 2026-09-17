import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaymentMethod } from '../../domain/enums';

export class FilterPaymentDto {
  @ApiPropertyOptional({
    description: 'Filtra pelo CPF do pagador, somente dígitos',
    example: '12345678901',
    pattern: '^\\d{11}$',
  })
  @IsOptional()
  @IsString({ message: 'CPF deve ser uma string' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos numéricos' })
  cpf?: string;

  @ApiPropertyOptional({ description: 'Filtra pelo método de pagamento', enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod, {
    message: 'Método de pagamento deve ser PIX ou CREDIT_CARD',
  })
  paymentMethod?: PaymentMethod;
}
