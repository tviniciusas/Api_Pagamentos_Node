import { Inject, Injectable } from '@nestjs/common';
import {
  IPaymentRepository,
  PAYMENT_REPOSITORY,
} from '../../domain/repositories/payment.repository.interface';
import { FilterPaymentDto, PaymentResponseDto } from '../dtos';

@Injectable()
export class FindAllPaymentsUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(filters?: FilterPaymentDto): Promise<PaymentResponseDto[]> {
    const payments = await this.paymentRepository.findAll(filters);

    return payments.map((payment) => PaymentResponseDto.fromEntity(payment));
  }
}
