import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MercadoPagoWebhookDto } from '../../application/dtos';
import { ProcessWebhookUseCase } from '../../application/use-cases';

@ApiTags('Webhook')
@Controller('api/webhook')
export class WebhookController {
  constructor(private readonly processWebhookUseCase: ProcessWebhookUseCase) {}

  @Post('mercado-pago')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook do Mercado Pago',
    description:
      'Recebe notificações de pagamento e sinaliza o workflow correspondente. Sempre responde 200 para evitar reenvios.',
  })
  @ApiOkResponse({ schema: { example: { received: true } } })
  async handleMercadoPagoWebhook(
    @Body() webhookData: MercadoPagoWebhookDto,
  ): Promise<{ received: boolean }> {
    await this.processWebhookUseCase.execute(webhookData);
    return { received: true };
  }
}
