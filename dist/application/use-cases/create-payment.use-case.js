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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentUseCase = void 0;
const common_1 = require("@nestjs/common");
const payment_entity_1 = require("../../domain/entities/payment.entity");
const enums_1 = require("../../domain/enums");
const payment_repository_interface_1 = require("../../domain/repositories/payment.repository.interface");
const payment_gateway_interface_1 = require("../../domain/services/payment-gateway.interface");
const dtos_1 = require("../dtos");
let CreatePaymentUseCase = class CreatePaymentUseCase {
    constructor(paymentRepository, paymentGateway) {
        this.paymentRepository = paymentRepository;
        this.paymentGateway = paymentGateway;
    }
    async execute(dto) {
        const payment = new payment_entity_1.Payment({
            cpf: dto.cpf,
            description: dto.description,
            amount: dto.amount,
            paymentMethod: dto.paymentMethod,
        });
        const savedPayment = await this.paymentRepository.create(payment);
        if (dto.paymentMethod === enums_1.PaymentMethod.CREDIT_CARD) {
            const preference = await this.paymentGateway.createPreference(savedPayment);
            savedPayment.setExternalId(preference.preferenceId);
            await this.paymentRepository.update(savedPayment);
            return dtos_1.PaymentResponseDto.fromEntity(savedPayment, preference.initPoint);
        }
        return dtos_1.PaymentResponseDto.fromEntity(savedPayment);
    }
};
exports.CreatePaymentUseCase = CreatePaymentUseCase;
exports.CreatePaymentUseCase = CreatePaymentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_repository_interface_1.PAYMENT_REPOSITORY)),
    __param(1, (0, common_1.Inject)(payment_gateway_interface_1.PAYMENT_GATEWAY)),
    __metadata("design:paramtypes", [Object, Object])
], CreatePaymentUseCase);
//# sourceMappingURL=create-payment.use-case.js.map