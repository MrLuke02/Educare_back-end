import { MigrationInterface, QueryRunner } from "typeorm";

import { Attributes } from "../../env/attributes";
import { Role } from "../../models/Role";
import { User } from "../../models/User";
import { UserRole } from "../../models/UserRole";
import { v4 as uuid } from "uuid";

export class CreateUserInstanceOnUserRole1627079464043
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager
      .createQueryBuilder()
      .select("users.id")
      .from(User, "users")
      .where("users.email = :email", { email: Attributes.ADM_EMAIL })
      .getOne();

    const role = await queryRunner.manager
      .createQueryBuilder()
      .select("roles.id")
      .from(Role, "roles")
      .where("roles.type = :type", { type: "User" })
      .getOne();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(UserRole)
      .values([
        {
          id: uuid(),
          userID: user.id,
          roleID: role.id,
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager
      .createQueryBuilder()
      .select("users.id")
      .from(User, "users")
      .where("users.email = :email", { email: Attributes.ADM_EMAIL })
      .getOne();

    const role = await queryRunner.manager
      .createQueryBuilder()
      .select("roles.id")
      .from(Role, "roles")
      .where("roles.type = :type", { type: "User" })
      .getOne();

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(UserRole)
      .where({
        userID: user.id,
        roleID: role.id,
      })
      .execute();
  }
}
