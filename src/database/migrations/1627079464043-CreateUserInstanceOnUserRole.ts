import { MigrationInterface, QueryRunner } from "typeorm";

import { RoleController } from "../../controllers/RoleController";
import { UserController } from "../../controllers/UserController";
import { Attributes } from "../../env/attributes";
import { Role } from "../../models/Role";
import { User } from "../../models/User";
import { UserRole } from "../../models/UserRole";

export class CreateUserInstanceOnUserRole1627079464043
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager.findOne(User, {
      email: Attributes.ADM_EMAIL,
    });

    const role = await queryRunner.manager.findOne(Role, {
      type: "User",
    });

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
    const user = await queryRunner.manager.findOne(User, {
      email: Attributes.ADM_EMAIL,
    });

    const role = await queryRunner.manager.findOne(Role, {
      type: "User",
    });

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
