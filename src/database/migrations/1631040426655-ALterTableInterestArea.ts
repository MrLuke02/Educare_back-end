import { MigrationInterface, QueryRunner } from "typeorm";

export class ALterTableInterestArea1631040426655 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("interest_area", "student_interest_area");
    await queryRunner.renameColumn(
      "student_interest_area",
      "interestArea",
      "studentInterestArea"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("student_interest_area", "interest_area");
    await queryRunner.renameColumn(
      "interest_area",
      "studentInterestArea",
      "interestArea"
    );
  }
}
