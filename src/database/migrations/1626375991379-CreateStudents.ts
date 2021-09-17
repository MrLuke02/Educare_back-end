import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateStudents1626375991379 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "students",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "interestAreaID",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "expiresIn",
            type: "int",
          },
          {
            name: "userID",
            type: "uuid",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FKUserStudent",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["userID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKInterestArea",
            referencedTableName: "interest_area",
            referencedColumnNames: ["id"],
            columnNames: ["interestAreaID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("students");
  }
}
