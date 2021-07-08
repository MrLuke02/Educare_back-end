import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableCompanyAddress1625513013431
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("companyAddresses", "company_addresses");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("company_addresses", "companyAddresses");
  }
}
