import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1618849805882 implements MigrationInterface {
  // metodo asincrono para a criação da tabela
  public async up(queryRunner: QueryRunner): Promise<void> {
    // criando a tabela
    await queryRunner.createTable(
      // definindo a estrutura da tabela, passando seu nome, e as especificações de cada coluna
      new Table({
        name: "users",
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

  // metodo asincrono para a deleção da tabela
  public async down(queryRunner: QueryRunner): Promise<void> {
    // deletando a tabela
    await queryRunner.dropTable("users");
  }
}
