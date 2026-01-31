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
exports.PaymentOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../domain/enums");
let PaymentOrmEntity = class PaymentOrmEntity {
};
exports.PaymentOrmEntity = PaymentOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PaymentOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 11 }),
    __metadata("design:type", String)
], PaymentOrmEntity.prototype, "cpf", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], PaymentOrmEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PaymentOrmEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.PaymentMethod,
        name: 'payment_method',
    }),
    __metadata("design:type", String)
], PaymentOrmEntity.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.PaymentStatus,
        default: enums_1.PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], PaymentOrmEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'external_id', nullable: true }),
    __metadata("design:type", String)
], PaymentOrmEntity.prototype, "externalId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PaymentOrmEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PaymentOrmEntity.prototype, "updatedAt", void 0);
exports.PaymentOrmEntity = PaymentOrmEntity = __decorate([
    (0, typeorm_1.Entity)('payments')
], PaymentOrmEntity);
//# sourceMappingURL=payment.orm-entity.js.map