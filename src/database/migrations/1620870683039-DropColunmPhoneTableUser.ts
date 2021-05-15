import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class DropColunmPhoneTableUser1620870683039
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "phone");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      // nome da tabela
      "users",
      // coluna
      new TableColumn({
        name: "phone",
        type: "varchar",
      })
    );
  }
}
