import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRoles1620246487639 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // criando a tabela
    await queryRunner.createTable(
      // passando a tabela e sua estruturação
      new Table({
        // nome da tabela
        name: "roles",
        // colunas com suas especificações
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "type",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // deletando a tabela
    await queryRunner.dropTable("roles");
  }
}
