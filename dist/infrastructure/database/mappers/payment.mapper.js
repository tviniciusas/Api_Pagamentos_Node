"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMapper = void 0;
const payment_entity_1 = require("../../../domain/entities/payment.entity");
class PaymentMapper {
    static toDomain(ormEntity) {
        return new payment_entity_1.Payment({
            id: ormEntity.id,
            cpf: ormEntity.cpf,
            description: ormEntity.description,
            amount: Number(ormEntity.amount),
            paymentMethod: ormEntity.paymentMethod,
            status: ormEntity.status,
            externalId: ormEntity.externalId,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
        });
    }
    static toOrm(domain) {
        return {
            id: domain.id || undefined,
            cpf: domain.cpf,
            description: domain.description,
            amount: domain.amount,
            paymentMethod: domain.paymentMethod,
            status: domain.status,
            externalId: domain.externalId,
            createdAt: domain.createdAt,
            updatedAt: domain.updatedAt,
        };
    }
}
exports.PaymentMapper = PaymentMapper;
//# sourceMappingURL=payment.mapper.js.map