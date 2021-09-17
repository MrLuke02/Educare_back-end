import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSolicitaions1626287805543 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "solicitations",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "file",
            type: "bytea",
          },
          {
            name: "status",
            type: "varchar",
          },
          {
            name: "userID",
            type: "uuid",
          },
          {
            name: "admID",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FKUserSolicitation",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["userID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKAdm",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["admID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("solicitations");
  }
}
