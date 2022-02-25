import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateEmployeeOrders1645216250381 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "employee_orders",
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
            name: "documentID",
            type: "uuid",
          },
          {
            name: "categoryID",
            type: "uuid",
          },
          {
            name: "companyID",
            type: "uuid",
          },
          {
            name: "copyNumber",
            type: "int",
          },
          {
            name: "isDelivery",
            type: "boolean",
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
            name: "FKEoUserOrder",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["userID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKEoDocument",
            referencedTableName: "documents",
            referencedColumnNames: ["id"],
            columnNames: ["documentID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKEoCategory",
            referencedTableName: "categories",
            referencedColumnNames: ["id"],
            columnNames: ["categoryID"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FKEoCompany",
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
    await queryRunner.dropTable("employee_orders");
  }
}
