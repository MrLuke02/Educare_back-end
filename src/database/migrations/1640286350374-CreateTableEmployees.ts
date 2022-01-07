import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableEmployees1640286350374 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "employees",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "occupation",
            type: "varchar",
          },
          {
            name: "userID",
            type: "uuid",
          },
          {
            name: "companyID",
            type: "uuid",
          },
        ],
        foreignKeys: [
          {
            name: "FKUserEmployee",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["userID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKCompanyEmployee",
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
    await queryRunner.dropTable("employees");
  }
}
