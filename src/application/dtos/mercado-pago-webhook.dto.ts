import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

// Mercado Pago sends numeric ids in some notifications and strings in others.
const toStringValue = ({ value }: { value: unknown }) =>
  value === null || value === undefined ? value : String(value);

class MercadoPagoWebhookDataDto {
  @ApiPropertyOptional({ description: 'ID do pagamento no Mercado Pago', example: '123456789' })
  @IsOptional()
  @Transform(toStringValue)
  @IsString()
  id?: string;
}

export class MercadoPagoWebhookDto {
  @ApiPropertyOptional({ example: '12345' })
  @IsOptional()
  @Transform(toStringValue)
  @IsString()
  id?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  live_mode?: boolean;

  @ApiProperty({ description: 'Tipo da notificação', example: 'payment' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: '2026-09-17T17:51:50.911Z' })
  @IsOptional()
  @IsString()
  date_created?: string;

  @ApiPropertyOptional({ example: '44444' })
  @IsOptional()
  @Transform(toStringValue)
  @IsString()
  user_id?: string;

  @ApiPropertyOptional({ example: 'v1' })
  @IsOptional()
  @IsString()
  api_version?: string;

  @ApiPropertyOptional({ example: 'payment.updated' })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional({ type: MercadoPagoWebhookDataDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MercadoPagoWebhookDataDto)
  data?: MercadoPagoWebhookDataDto;
}
