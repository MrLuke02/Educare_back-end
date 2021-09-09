import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { StudentInterestAreaController } from "../controllers/StudentInterestAreaController";

const studentInterestAreaController = new StudentInterestAreaController();
const verifyTokenUser = new VerifyTokenUser();

const routerStudentInterestArea = Router();

routerStudentInterestArea.post(
  "/studentInterestArea",
  verifyTokenUser.verifyTokenADM,
  studentInterestAreaController.create
);

routerStudentInterestArea.put(
  "/studentInterestArea",
  verifyTokenUser.verifyTokenADM,
  studentInterestAreaController.update
);

routerStudentInterestArea.get(
  "/studentInterestArea/:id",
  verifyTokenUser.verifyTokenADM,
  studentInterestAreaController.read
);

routerStudentInterestArea.delete(
  "/studentInterestArea/:id",
  verifyTokenUser.verifyTokenADM,
  studentInterestAreaController.delete
);

routerStudentInterestArea.get(
  "/showStudentInterestArea",
  verifyTokenUser.verifyTokenADM,
  studentInterestAreaController.show
);

export { routerStudentInterestArea };
