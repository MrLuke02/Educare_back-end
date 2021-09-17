import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AlterTableSolicitations1631839769949
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("solicitations", [
      new TableColumn({
        name: "course",
        type: "varchar",
      }),
      new TableColumn({
        name: "institution",
        type: "varchar",
      }),
      new TableColumn({
        name: "studentInterestAreaID",
        type: "uuid",
      }),
    ]);

    await queryRunner.createForeignKey(
      "solicitations",
      new TableForeignKey({
        name: "FKSolicitationsStudentInterestArea",
        referencedTableName: "student_interest_area",
        referencedColumnNames: ["id"],
        columnNames: ["studentInterestAreaID"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      "solicitations",
      "FKSolicitationsStudentInterestArea"
    );

    await queryRunner.dropColumns("solicitations", [
      new TableColumn({
        name: "course",
        type: "varchar",
      }),
      new TableColumn({
        name: "institution",
        type: "varchar",
      }),
      new TableColumn({
        name: "studentInterestAreaID",
        type: "uuid",
      }),
    ]);
  }
}
