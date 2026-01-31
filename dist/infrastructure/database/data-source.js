"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const payment_orm_entity_1 = require("./entities/payment.orm-entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'payment_db',
    entities: [payment_orm_entity_1.PaymentOrmEntity],
    migrations: ['src/infrastructure/database/migrations/*.ts'],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map