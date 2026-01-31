import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Payment } from '../../domain/entities/payment.entity';
import {
  CreatePreferenceResponse,
  IPaymentGateway,
} from '../../domain/services/payment-gateway.interface';

interface MercadoPagoPreferenceItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
}

interface MercadoPagoPreferenceRequest {
  items: MercadoPagoPreferenceItem[];
  external_reference: string;
  notification_url?: string;
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: string;
}

interface MercadoPagoPreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

@Injectable()
export class MercadoPagoService implements IPaymentGateway {
  private readonly logger = new Logger(MercadoPagoService.name);
  private readonly httpClient: AxiosInstance;
  private readonly baseUrl = 'https://api.mercadopago.com';

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN');

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async createPreference(payment: Payment): Promise<CreatePreferenceResponse> {
    try {
      const webhookUrl = this.configService.get<string>('MERCADO_PAGO_WEBHOOK_URL');
      const appUrl = this.configService.get<string>('APP_URL', 'http://localhost:3000');

      const preferenceData: MercadoPagoPreferenceRequest = {
        items: [
          {
            title: payment.description,
            quantity: 1,
            unit_price: payment.amount,
            currency_id: 'BRL',
          },
        ],
        external_reference: payment.id,
        notification_url: webhookUrl,
        back_urls: {
          success: `${appUrl}/payment/success`,
          failure: `${appUrl}/payment/failure`,
          pending: `${appUrl}/payment/pending`,
        },
        auto_return: 'approved',
      };

      this.logger.log(`Criando preferência no Mercado Pago para pagamento: ${payment.id}`);

      const response = await this.httpClient.post<MercadoPagoPreferenceResponse>(
        '/checkout/preferences',
        preferenceData,
      );

      this.logger.log(
        `Preferência criada com sucesso. ID: ${response.data.id}`,
      );

      const isSandbox = this.configService.get<string>('MERCADO_PAGO_SANDBOX', 'true') === 'true';

      return {
        preferenceId: response.data.id,
        initPoint: isSandbox
          ? response.data.sandbox_init_point
          : response.data.init_point,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao criar preferência no Mercado Pago: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
