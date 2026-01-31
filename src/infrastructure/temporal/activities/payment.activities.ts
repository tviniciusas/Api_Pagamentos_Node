import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { DataSource } from 'typeorm';
import { PaymentStatus } from '../../../domain/enums';
import { PaymentOrmEntity } from '../../database/entities/payment.orm-entity';
import { MercadoPagoPreference, PaymentData, PaymentRecord } from '../types';

const logger = new Logger('PaymentActivities');

let dataSource: DataSource;
let httpClient: AxiosInstance;
let configService: ConfigService;

export function initializeActivities(
  ds: DataSource,
  config: ConfigService,
): void {
  dataSource = ds;
  configService = config;

  const accessToken = config.get<string>('MERCADO_PAGO_ACCESS_TOKEN');
  httpClient = axios.create({
    baseURL: 'https://api.mercadopago.com',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function createPaymentRecord(
  paymentData: PaymentData,
): Promise<PaymentRecord> {
  logger.log(`Creating payment record for CPF: ${paymentData.cpf}`);

  const repository = dataSource.getRepository(PaymentOrmEntity);

  const paymentEntity = repository.create({
    cpf: paymentData.cpf,
    description: paymentData.description,
    amount: paymentData.amount,
    paymentMethod: paymentData.paymentMethod,
    status: PaymentStatus.PENDING,
  });

  const savedEntity = await repository.save(paymentEntity);

  logger.log(`Payment record created with ID: ${savedEntity.id}`);

  return {
    id: savedEntity.id,
    cpf: savedEntity.cpf,
    description: savedEntity.description,
    amount: Number(savedEntity.amount),
    paymentMethod: savedEntity.paymentMethod,
    status: savedEntity.status,
    externalId: savedEntity.externalId ?? undefined,
    createdAt: savedEntity.createdAt.toISOString(),
    updatedAt: savedEntity.updatedAt.toISOString(),
  };
}

export async function createMercadoPagoPreference(
  payment: PaymentRecord,
): Promise<MercadoPagoPreference> {
  logger.log(`Creating Mercado Pago preference for payment: ${payment.id}`);

  const webhookUrl = configService.get<string>('MERCADO_PAGO_WEBHOOK_URL');
  const appUrl = configService.get<string>('APP_URL', 'http://localhost:3000');

  const preferenceData = {
    items: [
      {
        title: payment.description,
        quantity: 1,
        unit_price: payment.amount,
        currency_id: 'BRL',
      },
    ],
    external_reference: payment.id,
    notification_url: webhookUrl,
    back_urls: {
      success: `${appUrl}/payment/success`,
      failure: `${appUrl}/payment/failure`,
      pending: `${appUrl}/payment/pending`,
    },
    auto_return: 'approved',
  };

  const response = await httpClient.post('/checkout/preferences', preferenceData);

  const isSandbox = configService.get<string>('MERCADO_PAGO_SANDBOX', 'true') === 'true';

  const preference: MercadoPagoPreference = {
    preferenceId: response.data.id,
    initPoint: isSandbox
      ? response.data.sandbox_init_point
      : response.data.init_point,
  };

  logger.log(`Mercado Pago preference created: ${preference.preferenceId}`);

  // Update payment with external ID
  const repository = dataSource.getRepository(PaymentOrmEntity);
  await repository.update(payment.id, { externalId: preference.preferenceId });

  return preference;
}

export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus,
): Promise<void> {
  logger.log(`Updating payment ${paymentId} to status: ${status}`);

  const repository = dataSource.getRepository(PaymentOrmEntity);
  await repository.update(paymentId, { status, updatedAt: new Date() });

  logger.log(`Payment ${paymentId} updated successfully`);
}

export async function getPaymentById(
  paymentId: string,
): Promise<PaymentRecord | null> {
  const repository = dataSource.getRepository(PaymentOrmEntity);
  const entity = await repository.findOne({ where: { id: paymentId } });

  if (!entity) {
    return null;
  }

  return {
    id: entity.id,
    cpf: entity.cpf,
    description: entity.description,
    amount: Number(entity.amount),
    paymentMethod: entity.paymentMethod,
    status: entity.status,
    externalId: entity.externalId ?? undefined,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
