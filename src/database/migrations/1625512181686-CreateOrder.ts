import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOrder1625512181686 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "orders",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "gen_random_uuid()",
          },
          {
            name: "userID",
            type: "uuid",
          },
          {
            name: "documentID",
            type: "uuid",
          },
          {
            name: "categoryID",
            type: "uuid",
          },
          {
            name: "copyNumber",
            type: "int",
          },
          {
            name: "price",
            type: "real",
          },
          {
            name: "status",
            type: "varchar",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
        ],
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
            name: "FKDocument",
            referencedTableName: "documents",
            referencedColumnNames: ["id"],
            columnNames: ["documentID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKCategory",
            referencedTableName: "categories",
            referencedColumnNames: ["id"],
            columnNames: ["categoryID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("orders");
  }
}
