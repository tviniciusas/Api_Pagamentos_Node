import { Repository } from 'typeorm';
import { Payment } from '../../../domain/entities/payment.entity';
import { IPaymentRepository, PaymentFilters } from '../../../domain/repositories/payment.repository.interface';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';
export declare class PaymentTypeOrmRepository implements IPaymentRepository {
    private readonly repository;
    constructor(repository: Repository<PaymentOrmEntity>);
    create(payment: Payment): Promise<Payment>;
    update(payment: Payment): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findAll(filters?: PaymentFilters): Promise<Payment[]>;
    findByExternalId(externalId: string): Promise<Payment | null>;
}
