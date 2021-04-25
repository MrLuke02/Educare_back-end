import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1618849805882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // criando a tabela
    await queryRunner.createTable(
      // passando a tabela e sua estruturação
      new Table({
        // nome da tabela
        name: "users",
        // colunas com suas especificações
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "email",
            type: "varchar",
          },
          {
            name: "password",
            type: "varchar",
          },
          {
            name: "phone",
            type: "varchar",
          },
          {
            name: "address",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "isAdm",
            type: "boolean",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // deletando a tabela
    await queryRunner.dropTable("users");
  }
}
