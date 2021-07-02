import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableCompany1623364003130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("companies", "inscricaoEstadual");
    await queryRunner.addColumn(
      "companies",
      new TableColumn({
        name: "companyCategory",
        type: "varchar",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("companies", "companyCategory");
    await queryRunner.addColumn(
      "companies",
      new TableColumn({
        name: "inscricaoEstadual",
        type: "varchar",
        isUnique: true,
      })
    );
  }
}
