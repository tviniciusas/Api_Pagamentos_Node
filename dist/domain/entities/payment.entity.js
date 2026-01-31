"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const enums_1 = require("../enums");
class Payment {
    constructor(props) {
        this._id = props.id ?? '';
        this._cpf = props.cpf;
        this._description = props.description;
        this._amount = props.amount;
        this._paymentMethod = props.paymentMethod;
        this._status = props.status ?? enums_1.PaymentStatus.PENDING;
        this._externalId = props.externalId;
        this._createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt ?? new Date();
    }
    get id() {
        return this._id;
    }
    get cpf() {
        return this._cpf;
    }
    get description() {
        return this._description;
    }
    get amount() {
        return this._amount;
    }
    get paymentMethod() {
        return this._paymentMethod;
    }
    get status() {
        return this._status;
    }
    get externalId() {
        return this._externalId;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    markAsPaid() {
        this._status = enums_1.PaymentStatus.PAID;
        this._updatedAt = new Date();
    }
    markAsFailed() {
        this._status = enums_1.PaymentStatus.FAIL;
        this._updatedAt = new Date();
    }
    setExternalId(externalId) {
        this._externalId = externalId;
        this._updatedAt = new Date();
    }
    updateStatus(status) {
        this._status = status;
        this._updatedAt = new Date();
    }
    isPix() {
        return this._paymentMethod === enums_1.PaymentMethod.PIX;
    }
    isCreditCard() {
        return this._paymentMethod === enums_1.PaymentMethod.CREDIT_CARD;
    }
    toJSON() {
        return {
            id: this._id,
            cpf: this._cpf,
            description: this._description,
            amount: this._amount,
            paymentMethod: this._paymentMethod,
            status: this._status,
            externalId: this._externalId,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}
exports.Payment = Payment;
//# sourceMappingURL=payment.entity.js.map