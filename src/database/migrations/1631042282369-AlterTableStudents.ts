import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableStudents1631042282369 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      "students",
      "interestAreaID",
      "studentInterestAreaID"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      "students",
      "studentInterestAreaID",
      "interestAreaID"
    );
  }
}
