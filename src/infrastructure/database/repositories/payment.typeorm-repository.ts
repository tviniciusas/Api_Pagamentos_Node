import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../../domain/entities/payment.entity';
import {
  IPaymentRepository,
  PaymentFilters,
} from '../../../domain/repositories/payment.repository.interface';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';
import { PaymentMapper } from '../mappers/payment.mapper';

@Injectable()
export class PaymentTypeOrmRepository implements IPaymentRepository {
  constructor(
    @InjectRepository(PaymentOrmEntity)
    private readonly repository: Repository<PaymentOrmEntity>,
  ) {}

  async create(payment: Payment): Promise<Payment> {
    const ormEntity = this.repository.create(PaymentMapper.toOrm(payment));
    const savedEntity = await this.repository.save(ormEntity);
    return PaymentMapper.toDomain(savedEntity);
  }

  async update(payment: Payment): Promise<Payment> {
    const ormEntity = PaymentMapper.toOrm(payment);
    await this.repository.update(payment.id, ormEntity);
    const updatedEntity = await this.repository.findOneBy({ id: payment.id });
    return PaymentMapper.toDomain(updatedEntity!);
  }

  async findById(id: string): Promise<Payment | null> {
    const ormEntity = await this.repository.findOneBy({ id });
    return ormEntity ? PaymentMapper.toDomain(ormEntity) : null;
  }

  async findAll(filters?: PaymentFilters): Promise<Payment[]> {
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
    return ormEntities.map(PaymentMapper.toDomain);
  }

  async findByExternalId(externalId: string): Promise<Payment | null> {
    const ormEntity = await this.repository.findOneBy({ externalId });
    return ormEntity ? PaymentMapper.toDomain(ormEntity) : null;
  }
}
