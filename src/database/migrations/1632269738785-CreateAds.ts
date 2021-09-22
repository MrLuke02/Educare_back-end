import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAds1632269738785 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "ads",
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
            name: "companyID",
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
            name: "FKCompanyAds",
            referencedTableName: "companies",
            referencedColumnNames: ["id"],
            columnNames: ["companyID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("ads");
  }
}
