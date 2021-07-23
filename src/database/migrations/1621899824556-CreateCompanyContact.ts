import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCompanyContact1621899824556 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "companyContacts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "gen_random_uuid()",
          },
          {
            name: "email",
            type: "varchar",
          },
          {
            name: "phone",
            type: "varchar",
          },
          {
            name: "companyID",
            type: "uuid",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FKCompanies",
            referencedTableName: "companies",
            referencedColumnNames: ["id"],
            columnNames: ["companyID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("companyContacts");
  }
}
