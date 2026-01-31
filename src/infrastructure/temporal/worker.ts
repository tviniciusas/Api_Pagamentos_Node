import { NativeConnection, Worker } from '@temporalio/worker';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { PaymentOrmEntity } from '../database/entities/payment.orm-entity';
import * as activities from './activities/payment.activities';

async function run() {
  console.log('Starting Temporal Worker...');

  // Create ConfigService manually for worker
  const configService = new ConfigService();

  // Initialize database connection
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'payment_db',
    entities: [PaymentOrmEntity],
    synchronize: process.env.NODE_ENV !== 'production',
  });

  await dataSource.initialize();
  console.log('Database connection established');

  // Initialize activities with dependencies
  activities.initializeActivities(dataSource, configService);

  // Connect to Temporal
  const temporalAddress = process.env.TEMPORAL_ADDRESS || 'localhost:7233';
  const taskQueue = process.env.TEMPORAL_TASK_QUEUE || 'payment-queue';

  console.log(`Connecting to Temporal at ${temporalAddress}`);

  const connection = await NativeConnection.connect({
    address: temporalAddress,
  });

  console.log('Connected to Temporal');

  // Create and start worker
  const worker = await Worker.create({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    taskQueue,
    workflowsPath: require.resolve('./workflows/payment.workflow'),
    activities,
  });

  console.log(`Worker started on task queue: ${taskQueue}`);

  // Handle shutdown gracefully
  const shutdown = async () => {
    console.log('Shutting down worker...');
    await worker.shutdown();
    await dataSource.destroy();
    console.log('Worker shutdown complete');
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Run the worker
  await worker.run();
}

run().catch((error) => {
  console.error('Worker failed to start:', error);
  process.exit(1);
});
