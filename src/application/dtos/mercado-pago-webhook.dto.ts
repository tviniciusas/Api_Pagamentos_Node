import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class MercadoPagoWebhookDataDto {
  @ApiPropertyOptional({ description: 'ID do recurso no Mercado Pago', example: '123456789' })
  id?: string;
}

export class MercadoPagoWebhookDto {
  @ApiPropertyOptional({ example: '12345' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsString()
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
  data?: {
    id?: string;
  };
}
