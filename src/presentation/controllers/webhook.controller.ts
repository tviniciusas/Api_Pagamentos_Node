import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MercadoPagoWebhookDto } from '../../application/dtos';
import { ProcessWebhookUseCase } from '../../application/use-cases';

@Controller('api/webhook')
export class WebhookController {
  constructor(private readonly processWebhookUseCase: ProcessWebhookUseCase) {}

  @Post('mercado-pago')
  @HttpCode(HttpStatus.OK)
  async handleMercadoPagoWebhook(
    @Body() webhookData: MercadoPagoWebhookDto,
  ): Promise<{ received: boolean }> {
    await this.processWebhookUseCase.execute(webhookData);
    return { received: true };
  }
}
