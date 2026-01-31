import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Connection } from '@temporalio/client';

export const TEMPORAL_CLIENT = Symbol('TemporalClient');

@Injectable()
export class TemporalClient implements OnModuleDestroy {
  private readonly logger = new Logger(TemporalClient.name);
  private client: Client | null = null;
  private connection: Connection | null = null;

  constructor(private readonly configService: ConfigService) {}

  async getClient(): Promise<Client> {
    if (this.client) {
      return this.client;
    }

    const address = this.configService.get<string>('TEMPORAL_ADDRESS', 'localhost:7233');

    this.logger.log(`Connecting to Temporal at ${address}`);

    this.connection = await Connection.connect({ address });
    this.client = new Client({
      connection: this.connection,
      namespace: this.configService.get<string>('TEMPORAL_NAMESPACE', 'default'),
    });

    this.logger.log('Connected to Temporal successfully');

    return this.client;
  }

  getTaskQueue(): string {
    return this.configService.get<string>('TEMPORAL_TASK_QUEUE', 'payment-queue');
  }

  getPaymentTimeoutMinutes(): number {
    return this.configService.get<number>('TEMPORAL_PAYMENT_TIMEOUT_MINUTES', 30);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.logger.log('Temporal connection closed');
    }
  }
}
