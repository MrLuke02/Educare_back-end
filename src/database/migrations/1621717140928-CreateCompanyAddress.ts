import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCompanyAddress1621717140928 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "companyAddresses",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "gen_random_uuid()",
          },
          {
            name: "street",
            type: "varchar",
          },
          {
            name: "houseNumber",
            type: "varchar",
          },
          {
            name: "bairro",
            type: "varchar",
          },
          {
            name: "state",
            type: "varchar",
          },
          {
            name: "city",
            type: "varchar",
          },
          {
            name: "cep",
            type: "varchar",
          },
          {
            name: "referencePoint",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "complement",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "companyID",
            type: "uuid",
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
    await queryRunner.dropTable("companyAddresses");
  }
}
