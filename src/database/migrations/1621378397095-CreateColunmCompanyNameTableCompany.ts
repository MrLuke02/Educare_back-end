import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class CreateColunmCompanyNameTableCompany1621378397095
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      // nome da tabela
      "companies",
      // coluna
      new TableColumn({
        name: "companyName",
        type: "varchar",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("companies", "companyName");
  }
}
