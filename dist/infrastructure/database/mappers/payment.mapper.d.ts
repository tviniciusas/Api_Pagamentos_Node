import { Payment } from '../../../domain/entities/payment.entity';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';
export declare class PaymentMapper {
    static toDomain(ormEntity: PaymentOrmEntity): Payment;
    static toOrm(domain: Payment): Partial<PaymentOrmEntity>;
}
