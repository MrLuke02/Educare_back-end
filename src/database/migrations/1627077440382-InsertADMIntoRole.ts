import { MigrationInterface, QueryRunner } from "typeorm";
import { Role } from "../../models/Role";
import { v4 as uuid } from "uuid";

export class InsertADMIntoRole1627077440382 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("roles")
      .values([
        {
          id: uuid(),
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
