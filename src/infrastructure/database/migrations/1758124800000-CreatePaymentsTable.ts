import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentsTable1758124800000 implements MigrationInterface {
  name = 'CreatePaymentsTable1758124800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('PIX', 'CREDIT_CARD')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_status_enum" AS ENUM('PENDING', 'PAID', 'FAIL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "cpf" character varying(11) NOT NULL,
        "description" character varying(255) NOT NULL,
        "amount" numeric(10,2) NOT NULL,
        "payment_method" "public"."payments_payment_method_enum" NOT NULL,
        "status" "public"."payments_status_enum" NOT NULL DEFAULT 'PENDING',
        "external_id" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payments_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_payments_cpf" ON "payments" ("cpf")`);
    await queryRunner.query(`CREATE INDEX "IDX_payments_status" ON "payments" ("status")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_payments_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_payments_cpf"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payments_payment_method_enum"`);
  }
}
