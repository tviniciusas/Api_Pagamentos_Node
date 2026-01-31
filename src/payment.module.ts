import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CreatePaymentUseCase,
  FindAllPaymentsUseCase,
  FindPaymentByIdUseCase,
  ProcessWebhookUseCase,
  UpdatePaymentUseCase,
} from './application/use-cases';
import { PAYMENT_REPOSITORY } from './domain/repositories/payment.repository.interface';
import { PAYMENT_GATEWAY } from './domain/services/payment-gateway.interface';
import { PaymentOrmEntity } from './infrastructure/database/entities/payment.orm-entity';
import { PaymentTypeOrmRepository } from './infrastructure/database/repositories/payment.typeorm-repository';
import { MercadoPagoService } from './infrastructure/services/mercado-pago.service';
import { PaymentController } from './presentation/controllers/payment.controller';
import { WebhookController } from './presentation/controllers/webhook.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentOrmEntity])],
  controllers: [PaymentController, WebhookController],
  providers: [
    // Use Cases
    CreatePaymentUseCase,
    UpdatePaymentUseCase,
    FindPaymentByIdUseCase,
    FindAllPaymentsUseCase,
    ProcessWebhookUseCase,
    // Repositories
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentTypeOrmRepository,
    },
    // External Services
    {
      provide: PAYMENT_GATEWAY,
      useClass: MercadoPagoService,
    },
  ],
  exports: [PAYMENT_REPOSITORY],
})
export class PaymentModule {}
