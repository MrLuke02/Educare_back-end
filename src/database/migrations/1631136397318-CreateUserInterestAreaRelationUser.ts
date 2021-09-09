import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserInterestAreaRelationUser1631136397318
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // criando a tabela
    await queryRunner.createTable(
      // passando a tabela e sua estruturação
      new Table({
        // nome da tabela
        name: "user_interest_area_relation_user",
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
            name: "userInterestAreaID",
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
            name: "FKUserInterestArea",
            referencedTableName: "user_interest_area",
            referencedColumnNames: ["id"],
            columnNames: ["userInterestAreaID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_interest_area_relation_user");
  }
}
