import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableCategories1625181942418 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "categories",
      "name",
      new TableColumn({
        name: "name",
        type: "varchar",
        isUnique: true,
      })
    );
    await queryRunner.addColumns("categories", [
      new TableColumn({
        name: "colorful",
        type: "boolean",
      }),
      new TableColumn({
        name: "hasAd",
        type: "boolean",
      }),
      new TableColumn({
        name: "deliveryTimeInDays",
        type: "int",
      }),
      new TableColumn({
        name: "qtdMaxPage",
        type: "int",
        isNullable: true,
      }),
      new TableColumn({
        name: "qtdMinPage",
        type: "int",
      }),
      new TableColumn({
        name: "limiteCopiesMonthly",
        type: "int",
        isNullable: true,
      }),
      new TableColumn({
        name: "limiteCopiesMonthlyUser",
        type: "int",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "categories",
      "name",
      new TableColumn({
        name: "name",
        type: "varchar",
        isUnique: false,
      })
    );
    await queryRunner.dropColumns("categories", [
      new TableColumn({
        name: "colorful",
        type: "boolean",
      }),
      new TableColumn({
        name: "hasAd",
        type: "boolean",
      }),
      new TableColumn({
        name: "deliveryTimeInDays",
        type: "int",
      }),
      new TableColumn({
        name: "qtdMaxPage",
        type: "int",
        isNullable: true,
      }),
      new TableColumn({
        name: "qtdMinPage",
        type: "int",
      }),
      new TableColumn({
        name: "limiteCopiesMonthly",
        type: "int",
        isNullable: true,
      }),
      new TableColumn({
        name: "limiteCopiesMonthlyUser",
        type: "int",
        isNullable: true,
      }),
    ]);
  }
}
