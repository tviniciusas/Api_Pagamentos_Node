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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ProcessWebhookUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessWebhookUseCase = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../domain/enums");
const payment_repository_interface_1 = require("../../domain/repositories/payment.repository.interface");
let ProcessWebhookUseCase = ProcessWebhookUseCase_1 = class ProcessWebhookUseCase {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
        this.logger = new common_1.Logger(ProcessWebhookUseCase_1.name);
    }
    async execute(webhookData) {
        this.logger.log(`Recebido webhook do Mercado Pago: ${JSON.stringify(webhookData)}`);
        if (webhookData.type !== 'payment') {
            this.logger.log(`Tipo de webhook ignorado: ${webhookData.type}`);
            return;
        }
        const externalId = webhookData.data?.id;
        if (!externalId) {
            this.logger.warn('Webhook sem ID de pagamento externo');
            return;
        }
        const payment = await this.paymentRepository.findByExternalId(externalId);
        if (!payment) {
            this.logger.warn(`Pagamento não encontrado para externalId: ${externalId}`);
            return;
        }
        const newStatus = this.mapWebhookActionToStatus(webhookData.action);
        if (newStatus) {
            payment.updateStatus(newStatus);
            await this.paymentRepository.update(payment);
            this.logger.log(`Pagamento ${payment.id} atualizado para status: ${newStatus}`);
        }
    }
    mapWebhookActionToStatus(action) {
        switch (action) {
            case 'payment.approved':
                return enums_1.PaymentStatus.PAID;
            case 'payment.rejected':
            case 'payment.cancelled':
                return enums_1.PaymentStatus.FAIL;
            default:
                return null;
        }
    }
};
exports.ProcessWebhookUseCase = ProcessWebhookUseCase;
exports.ProcessWebhookUseCase = ProcessWebhookUseCase = ProcessWebhookUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_repository_interface_1.PAYMENT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ProcessWebhookUseCase);
//# sourceMappingURL=process-webhook.use-case.js.map