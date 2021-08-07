import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableAddresses1628342874830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      "addresses",
      new TableColumn({
        name: "referencePoint",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "addresses",
      new TableColumn({
        name: "referencePoint",
        type: "varchar",
        isNullable: true,
      })
    );
  }
}
