import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuid } from "uuid";
import { Role } from "../../models/Role";

export class InsertStudentIntoRoles1631841663399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("roles")
      .values([
        {
          id: uuid(),
          type: "Student",
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Role)
      .where("type = :type", { type: "Student" })
      .execute();
  }
}
