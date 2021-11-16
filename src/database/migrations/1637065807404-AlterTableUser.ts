import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableUser1637065807404 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "image",
        type: "bytea",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      "users",
      new TableColumn({
        name: "image",
        type: "bytea",
        isNullable: true,
      })
    );
  }
}
