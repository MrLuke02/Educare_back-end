import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserRole1620350661376 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // criando a tabela
    await queryRunner.createTable(
      // passando a tabela e sua estruturação
      new Table({
        // nome da tabela
        name: "user_roles",
        // colunas com suas especificações
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "userID",
            type: "uuid",
          },
          {
            name: "roleID",
            type: "uuid",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
        ],
        // criando as chaves esrangeiras
        foreignKeys: [
          {
            name: "FKUser",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["userID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKRole",
            referencedTableName: "roles",
            referencedColumnNames: ["id"],
            columnNames: ["roleID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // deletando a tabela
    await queryRunner.dropTable("user_roles");
  }
}
