import { MigrationInterface, QueryRunner } from "typeorm";

import { RoleController } from "../../controllers/RoleController";
import { UserController } from "../../controllers/UserController";
import { Attributes } from "../../env/attributes";
import { Role } from "../../models/Role";
import { User } from "../../models/User";
import { UserRole } from "../../models/UserRole";

export class CreateADMInstanceOnUserRole1627079386034
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
      .where("roles.type = :type", { type: "ADM" })
      .getOne();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(UserRole)
      .values([
        {
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
      .where("roles.type = :type", { type: "ADM" })
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
