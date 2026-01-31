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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentDto = void 0;
const class_validator_1 = require("class-validator");
const enums_1 = require("../../domain/enums");
class CreatePaymentDto {
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'CPF é obrigatório' }),
    (0, class_validator_1.IsString)({ message: 'CPF deve ser uma string' }),
    (0, class_validator_1.Matches)(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos numéricos' }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Descrição é obrigatória' }),
    (0, class_validator_1.IsString)({ message: 'Descrição deve ser uma string' }),
    (0, class_validator_1.MinLength)(3, { message: 'Descrição deve ter no mínimo 3 caracteres' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Descrição deve ter no máximo 255 caracteres' }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Valor é obrigatório' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Valor deve ser um número' }),
    (0, class_validator_1.IsPositive)({ message: 'Valor deve ser positivo' }),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Método de pagamento é obrigatório' }),
    (0, class_validator_1.IsEnum)(enums_1.PaymentMethod, {
        message: 'Método de pagamento deve ser PIX ou CREDIT_CARD',
    }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentMethod", void 0);
//# sourceMappingURL=create-payment.dto.js.map