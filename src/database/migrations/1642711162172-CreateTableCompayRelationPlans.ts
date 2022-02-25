import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableCompayRelationPlans1642711162172
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "company_relation_plans",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "companyID",
            type: "uuid",
          },
          {
            name: "planID",
            type: "uuid",
          },
          {
            name: "expiresIn",
            type: "int",
          },
          {
            name: "usedLimit",
            type: "int",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FKCompanyRelation",
            referencedTableName: "companies",
            referencedColumnNames: ["id"],
            columnNames: ["companyID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKPlanRelation",
            referencedTableName: "plans",
            referencedColumnNames: ["id"],
            columnNames: ["planID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("company_relation_plans");
  }
}
