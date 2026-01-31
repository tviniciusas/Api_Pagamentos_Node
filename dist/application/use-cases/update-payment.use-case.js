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
exports.UpdatePaymentUseCase = void 0;
const common_1 = require("@nestjs/common");
const payment_repository_interface_1 = require("../../domain/repositories/payment.repository.interface");
const dtos_1 = require("../dtos");
let UpdatePaymentUseCase = class UpdatePaymentUseCase {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async execute(id, dto) {
        const payment = await this.paymentRepository.findById(id);
        if (!payment) {
            throw new common_1.NotFoundException(`Pagamento com ID ${id} não encontrado`);
        }
        if (dto.status) {
            payment.updateStatus(dto.status);
        }
        const updatedPayment = await this.paymentRepository.update(payment);
        return dtos_1.PaymentResponseDto.fromEntity(updatedPayment);
    }
};
exports.UpdatePaymentUseCase = UpdatePaymentUseCase;
exports.UpdatePaymentUseCase = UpdatePaymentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_repository_interface_1.PAYMENT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], UpdatePaymentUseCase);
//# sourceMappingURL=update-payment.use-case.js.map