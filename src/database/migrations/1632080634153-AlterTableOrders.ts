import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableOrders1632080634153 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "orders",
      new TableColumn({
        name: "isDelivery",
        type: "boolean",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      "orders",
      new TableColumn({
        name: "isDelivery",
        type: "boolean",
      })
    );
  }
}
