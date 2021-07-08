import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableCompanyContacts1625513162104
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("companyContacts", "company_contacts");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("company_contacts", "companyContacts");
  }
}
