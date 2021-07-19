import { RoleController } from "../controllers/RoleController";
import { StudentController } from "../controllers/StudentController";
import { UserController } from "../controllers/UserController";
import { UserRoleController } from "../controllers/UserRoleController";

async function verifyExpiredStudent(userID: string) {
  const userController = new UserController();

  const user = await userController.readFromController(userID);

  if (user) {
    const type = "Student";

    const roleController = new RoleController();

    const role = await roleController.readFromType(type);

    if (role) {
      const userRoleController = new UserRoleController();

      const userRole = await userRoleController.readFromUserRole(
        user.id,
        role.id
      );

      if (userRole) {
        const studentController = new StudentController();

        const studentIsExpired = await studentController.readStudentExpires(
          userID
        );

        console.log(studentIsExpired);

        if (studentIsExpired) {
          console.log("aki");

          await userRoleController.deleteFromController(userRole.id);
        }
      }
    }
  }
}

export { verifyExpiredStudent };
