import { MigrationInterface, QueryRunner } from "typeorm";
import md5 from "md5";

import { Attributes } from "../../env/attributes";
import { User } from "../../models/User";

export class CreateUserInstance1627077869481 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into("users")
      .values([
        {
          name: Attributes.ADM_NAME,
          email: Attributes.ADM_EMAIL,
          password: md5(Attributes.ADM_PASSWORD),
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("email = :email", { email: Attributes.ADM_EMAIL })
      .execute();
  }
}
