"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const use_cases_1 = require("./application/use-cases");
const payment_repository_interface_1 = require("./domain/repositories/payment.repository.interface");
const payment_gateway_interface_1 = require("./domain/services/payment-gateway.interface");
const payment_orm_entity_1 = require("./infrastructure/database/entities/payment.orm-entity");
const payment_typeorm_repository_1 = require("./infrastructure/database/repositories/payment.typeorm-repository");
const mercado_pago_service_1 = require("./infrastructure/services/mercado-pago.service");
const payment_controller_1 = require("./presentation/controllers/payment.controller");
const webhook_controller_1 = require("./presentation/controllers/webhook.controller");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([payment_orm_entity_1.PaymentOrmEntity])],
        controllers: [payment_controller_1.PaymentController, webhook_controller_1.WebhookController],
        providers: [
            use_cases_1.CreatePaymentUseCase,
            use_cases_1.UpdatePaymentUseCase,
            use_cases_1.FindPaymentByIdUseCase,
            use_cases_1.FindAllPaymentsUseCase,
            use_cases_1.ProcessWebhookUseCase,
            {
                provide: payment_repository_interface_1.PAYMENT_REPOSITORY,
                useClass: payment_typeorm_repository_1.PaymentTypeOrmRepository,
            },
            {
                provide: payment_gateway_interface_1.PAYMENT_GATEWAY,
                useClass: mercado_pago_service_1.MercadoPagoService,
            },
        ],
        exports: [payment_repository_interface_1.PAYMENT_REPOSITORY],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map