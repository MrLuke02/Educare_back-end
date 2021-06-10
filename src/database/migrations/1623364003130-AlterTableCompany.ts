import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableCompany1623364003130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "companies",
      "inscricaoEstadual",
      new TableColumn({
        name: "companyCategory",
        type: "varchar",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "companies",
      "companyCategory",
      new TableColumn({
        name: "inscricaoEstadual",
        type: "varchar",
      })
    );
  }
}
