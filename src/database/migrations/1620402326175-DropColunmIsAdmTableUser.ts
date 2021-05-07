import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class DropColunmIsAdmTableUser1620402326175
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // deletando a coluna isAdm da tabela users
    await queryRunner.dropColumn("users", "isAdm");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // criando a coluna isAdm na tabela users
    await queryRunner.addColumn(
      // nome da tabela
      "users",
      // coluna
      new TableColumn({
        name: "isAdm",
        type: "boolean",
      })
    );
  }
}
