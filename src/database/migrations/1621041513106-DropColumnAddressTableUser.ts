import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class DropColumnAddressTableUser1621041513106
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "address");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      // nome da tabela
      "users",
      // coluna
      new TableColumn({
        name: "address",
        type: "string",
        isNullable: true,
      })
    );
  }
}
