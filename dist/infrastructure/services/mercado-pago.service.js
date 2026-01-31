"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MercadoPagoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let MercadoPagoService = MercadoPagoService_1 = class MercadoPagoService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MercadoPagoService_1.name);
        this.baseUrl = 'https://api.mercadopago.com';
        const accessToken = this.configService.get('MERCADO_PAGO_ACCESS_TOKEN');
        this.httpClient = axios_1.default.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }
    async createPreference(payment) {
        try {
            const webhookUrl = this.configService.get('MERCADO_PAGO_WEBHOOK_URL');
            const appUrl = this.configService.get('APP_URL', 'http://localhost:3000');
            const preferenceData = {
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
            const response = await this.httpClient.post('/checkout/preferences', preferenceData);
            this.logger.log(`Preferência criada com sucesso. ID: ${response.data.id}`);
            const isSandbox = this.configService.get('MERCADO_PAGO_SANDBOX', 'true') === 'true';
            return {
                preferenceId: response.data.id,
                initPoint: isSandbox
                    ? response.data.sandbox_init_point
                    : response.data.init_point,
            };
        }
        catch (error) {
            this.logger.error(`Erro ao criar preferência no Mercado Pago: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.MercadoPagoService = MercadoPagoService;
exports.MercadoPagoService = MercadoPagoService = MercadoPagoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MercadoPagoService);
//# sourceMappingURL=mercado-pago.service.js.map