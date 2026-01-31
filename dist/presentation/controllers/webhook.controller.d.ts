import { MercadoPagoWebhookDto } from '../../application/dtos';
import { ProcessWebhookUseCase } from '../../application/use-cases';
export declare class WebhookController {
    private readonly processWebhookUseCase;
    constructor(processWebhookUseCase: ProcessWebhookUseCase);
    handleMercadoPagoWebhook(webhookData: MercadoPagoWebhookDto): Promise<{
        received: boolean;
    }>;
}
