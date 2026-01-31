import { Payment } from '../../../domain/entities/payment.entity';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';

export class PaymentMapper {
  static toDomain(ormEntity: PaymentOrmEntity): Payment {
    return new Payment({
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

  static toOrm(domain: Payment): Partial<PaymentOrmEntity> {
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
