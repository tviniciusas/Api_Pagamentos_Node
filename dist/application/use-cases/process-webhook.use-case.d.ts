import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { MercadoPagoWebhookDto } from '../dtos';
export declare class ProcessWebhookUseCase {
    private readonly paymentRepository;
    private readonly logger;
    constructor(paymentRepository: IPaymentRepository);
    execute(webhookData: MercadoPagoWebhookDto): Promise<void>;
    private mapWebhookActionToStatus;
}
