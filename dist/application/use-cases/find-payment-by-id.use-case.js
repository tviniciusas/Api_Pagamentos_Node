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
exports.FindPaymentByIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const payment_repository_interface_1 = require("../../domain/repositories/payment.repository.interface");
const dtos_1 = require("../dtos");
let FindPaymentByIdUseCase = class FindPaymentByIdUseCase {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async execute(id) {
        const payment = await this.paymentRepository.findById(id);
        if (!payment) {
            throw new common_1.NotFoundException(`Pagamento com ID ${id} não encontrado`);
        }
        return dtos_1.PaymentResponseDto.fromEntity(payment);
    }
};
exports.FindPaymentByIdUseCase = FindPaymentByIdUseCase;
exports.FindPaymentByIdUseCase = FindPaymentByIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_repository_interface_1.PAYMENT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], FindPaymentByIdUseCase);
//# sourceMappingURL=find-payment-by-id.use-case.js.map