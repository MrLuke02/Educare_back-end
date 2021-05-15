import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableAddress1621041711300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "addresses",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
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
            name: "userID",
            type: "uuid",
          },
        ],
        foreignKeys: [
          {
            name: "FKUser",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["userID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("addresses");
  }
}
