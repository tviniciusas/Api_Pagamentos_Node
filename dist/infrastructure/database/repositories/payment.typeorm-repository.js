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
exports.PaymentTypeOrmRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_orm_entity_1 = require("../entities/payment.orm-entity");
const payment_mapper_1 = require("../mappers/payment.mapper");
let PaymentTypeOrmRepository = class PaymentTypeOrmRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async create(payment) {
        const ormEntity = this.repository.create(payment_mapper_1.PaymentMapper.toOrm(payment));
        const savedEntity = await this.repository.save(ormEntity);
        return payment_mapper_1.PaymentMapper.toDomain(savedEntity);
    }
    async update(payment) {
        const ormEntity = payment_mapper_1.PaymentMapper.toOrm(payment);
        await this.repository.update(payment.id, ormEntity);
        const updatedEntity = await this.repository.findOneBy({ id: payment.id });
        return payment_mapper_1.PaymentMapper.toDomain(updatedEntity);
    }
    async findById(id) {
        const ormEntity = await this.repository.findOneBy({ id });
        return ormEntity ? payment_mapper_1.PaymentMapper.toDomain(ormEntity) : null;
    }
    async findAll(filters) {
        const queryBuilder = this.repository.createQueryBuilder('payment');
        if (filters?.cpf) {
            queryBuilder.andWhere('payment.cpf = :cpf', { cpf: filters.cpf });
        }
        if (filters?.paymentMethod) {
            queryBuilder.andWhere('payment.paymentMethod = :paymentMethod', {
                paymentMethod: filters.paymentMethod,
            });
        }
        queryBuilder.orderBy('payment.createdAt', 'DESC');
        const ormEntities = await queryBuilder.getMany();
        return ormEntities.map(payment_mapper_1.PaymentMapper.toDomain);
    }
    async findByExternalId(externalId) {
        const ormEntity = await this.repository.findOneBy({ externalId });
        return ormEntity ? payment_mapper_1.PaymentMapper.toDomain(ormEntity) : null;
    }
};
exports.PaymentTypeOrmRepository = PaymentTypeOrmRepository;
exports.PaymentTypeOrmRepository = PaymentTypeOrmRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_orm_entity_1.PaymentOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentTypeOrmRepository);
//# sourceMappingURL=payment.typeorm-repository.js.map