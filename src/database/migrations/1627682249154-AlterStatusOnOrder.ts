import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterStatusOnOrder1627682249154 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("orders", "status", new TableColumn({
            name: "statusID",
            type: "uuid"
        }))
        await queryRunner.createForeignKey("orders", new TableForeignKey(
            {
                name: "FKOrder",
                referencedTableName: "order_status",
                referencedColumnNames: ["id"],
                columnNames: ["statusID"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("orders", "statusID", new TableColumn({
            name: "status",
            type: "varchar"
        }))
        await queryRunner.dropForeignKey("orders", new TableForeignKey(
            {
                name: "FKOrder",
                referencedTableName: "order_status",
                referencedColumnNames: ["id"],
                columnNames: ["statusID"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            }));
    }

}
