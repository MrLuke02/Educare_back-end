import { MigrationInterface, QueryRunner } from "typeorm";
import { Role } from "../../models/Role";

export class InsertADMIntoRole1627077440382 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("roles")
      .values([
        {
          type: "ADM",
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Role)
      .where("type = :type", { type: "ADM" })
      .execute();
  }
}
