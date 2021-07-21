import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";

import { StudentController } from "../controllers/StudentController";

const studentController = new StudentController();
const verifyTokenUser = new VerifyTokenUser();

const routerStudent = Router();

routerStudent.get(
  "/student/:id",
  verifyTokenUser.verifyADMUserByStudentID,
  studentController.read
);

routerStudent.put(
  "/student",
  verifyTokenUser.verifyADMUserByStudentID,
  studentController.update
);

routerStudent.get(
  "/showStudents",
  verifyTokenUser.verifyTokenADM,
  studentController.show
);

routerStudent.delete(
  "/student/:id",
  verifyTokenUser.verifyADMUserByStudentID,
  studentController.delete
);

export { routerStudent };
