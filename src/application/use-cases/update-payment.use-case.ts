import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IPaymentRepository,
  PAYMENT_REPOSITORY,
} from '../../domain/repositories/payment.repository.interface';
import { PaymentResponseDto, UpdatePaymentDto } from '../dtos';

@Injectable()
export class UpdatePaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(id: string, dto: UpdatePaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findById(id);

    if (!payment) {
      throw new NotFoundException(`Pagamento com ID ${id} não encontrado`);
    }

    if (dto.status) {
      payment.updateStatus(dto.status);
    }

    const updatedPayment = await this.paymentRepository.update(payment);

    return PaymentResponseDto.fromEntity(updatedPayment);
  }
}
