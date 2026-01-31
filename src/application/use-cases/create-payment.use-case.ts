import { Inject, Injectable } from '@nestjs/common';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentMethod } from '../../domain/enums';
import {
  IPaymentRepository,
  PAYMENT_REPOSITORY,
} from '../../domain/repositories/payment.repository.interface';
import {
  IPaymentGateway,
  PAYMENT_GATEWAY,
} from '../../domain/services/payment-gateway.interface';
import { CreatePaymentDto, PaymentResponseDto } from '../dtos';

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const payment = new Payment({
      cpf: dto.cpf,
      description: dto.description,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
    });

    const savedPayment = await this.paymentRepository.create(payment);

    if (dto.paymentMethod === PaymentMethod.CREDIT_CARD) {
      const preference = await this.paymentGateway.createPreference(savedPayment);

      savedPayment.setExternalId(preference.preferenceId);
      await this.paymentRepository.update(savedPayment);

      return PaymentResponseDto.fromEntity(savedPayment, preference.initPoint);
    }

    return PaymentResponseDto.fromEntity(savedPayment);
  }
}
