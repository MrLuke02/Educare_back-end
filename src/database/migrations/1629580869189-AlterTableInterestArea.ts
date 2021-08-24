import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableInterestArea1629580869189 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("interest_area", "courses");

    await queryRunner.renameColumn("courses", "interestArea", "course");

    await queryRunner.renameColumn("students", "interestAreaID", "courseID");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("courses", "interest_area");
    await queryRunner.renameColumn("interest_area", "course", "interestArea");

    await queryRunner.renameColumn("students", "courseID", "interestAreaID");
  }
}
