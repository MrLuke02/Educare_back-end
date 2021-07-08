import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateDocuments1625332588748 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "documents",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "type",
            type: "varchar",
          },
          {
            name: "size",
            type: "int",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "pageNumber",
            type: "int",
          },
          {
            name: "file",
            type: "bytea",
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
    await queryRunner.dropTable("documents");
  }
}
