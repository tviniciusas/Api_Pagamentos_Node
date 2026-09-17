import { join } from 'path';
import { DataSource } from 'typeorm';
import { PaymentOrmEntity } from './entities/payment.orm-entity';

// Resolve migrations relative to this file so the same config works
// when running from `src` (ts-node) and from `dist` (compiled JS).
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'payment_db',
  entities: [PaymentOrmEntity],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  migrationsTableName: 'migrations',
  synchronize: false,
});
