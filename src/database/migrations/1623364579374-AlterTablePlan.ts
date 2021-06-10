import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablePlan1623364579374 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("plans", "categories");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("categories", "plans");
  }
}
