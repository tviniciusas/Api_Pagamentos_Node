import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MercadoPagoWebhookDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  live_mode?: boolean;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  date_created?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  api_version?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  data?: {
    id?: string;
  };
}
