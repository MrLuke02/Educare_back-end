import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTablePlans1642098597996 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "plans",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "price",
            type: "real",
          },
          {
            name: "colorful",
            type: "boolean",
          },
          {
            name: "limiteCopies",
            type: "int",
          },
          {
            name: "excessValue",
            type: "real",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("plans");
  }
}
