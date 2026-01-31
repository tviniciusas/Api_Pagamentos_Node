import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaymentMethod } from '../../domain/enums';

export class FilterPaymentDto {
  @IsOptional()
  @IsString({ message: 'CPF deve ser uma string' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos numéricos' })
  cpf?: string;

  @IsOptional()
  @IsEnum(PaymentMethod, {
    message: 'Método de pagamento deve ser PIX ou CREDIT_CARD',
  })
  paymentMethod?: PaymentMethod;
}
