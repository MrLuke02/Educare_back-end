import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableUsers1628341416682 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "biography",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      "users",
      new TableColumn({
        name: "biography",
        type: "varchar",
        isNullable: true,
      })
    );
  }
}
