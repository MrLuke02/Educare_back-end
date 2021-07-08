import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableCategories1625775872055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "categories",
      "value",
      new TableColumn({
        name: "price",
        type: "real",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "categories",
      "price",
      new TableColumn({
        name: "value",
        type: "numeric",
      })
    );
  }
}
