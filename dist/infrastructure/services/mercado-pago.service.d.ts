import { ConfigService } from '@nestjs/config';
import { Payment } from '../../domain/entities/payment.entity';
import { CreatePreferenceResponse, IPaymentGateway } from '../../domain/services/payment-gateway.interface';
export declare class MercadoPagoService implements IPaymentGateway {
    private readonly configService;
    private readonly logger;
    private readonly httpClient;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    createPreference(payment: Payment): Promise<CreatePreferenceResponse>;
}
