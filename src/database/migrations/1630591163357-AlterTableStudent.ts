import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableStudent1630591163357 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("students", [
      new TableColumn({
        name: "course",
        type: "varchar",
      }),
      new TableColumn({
        name: "institution",
        type: "varchar",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns("students", [
      new TableColumn({
        name: "course",
        type: "varchar",
      }),
      new TableColumn({
        name: "institution",
        type: "varchar",
      }),
    ]);
  }
}
