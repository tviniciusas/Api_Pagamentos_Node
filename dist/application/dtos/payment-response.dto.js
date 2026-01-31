"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentResponseDto = void 0;
class PaymentResponseDto {
    static fromEntity(payment, initPoint) {
        const dto = new PaymentResponseDto();
        dto.id = payment.id;
        dto.cpf = payment.cpf;
        dto.description = payment.description;
        dto.amount = payment.amount;
        dto.paymentMethod = payment.paymentMethod;
        dto.status = payment.status;
        dto.initPoint = initPoint;
        dto.createdAt = payment.createdAt;
        dto.updatedAt = payment.updatedAt;
        return dto;
    }
}
exports.PaymentResponseDto = PaymentResponseDto;
//# sourceMappingURL=payment-response.dto.js.map