import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { StudentInterestAreaController } from "../controllers/StudentInterestAreaController";

const interestAreaController = new StudentInterestAreaController();
const verifyTokenUser = new VerifyTokenUser();

const routerStudentInterestArea = Router();

routerStudentInterestArea.post(
  "/studentInterestArea",
  verifyTokenUser.verifyTokenADM,
  interestAreaController.create
);

routerStudentInterestArea.put(
  "/studentInterestArea",
  verifyTokenUser.verifyTokenADM,
  interestAreaController.update
);

routerStudentInterestArea.get(
  "/studentInterestArea/:id",
  verifyTokenUser.verifyTokenADM,
  interestAreaController.read
);

routerStudentInterestArea.delete(
  "/studentInterestArea/:id",
  verifyTokenUser.verifyTokenADM,
  interestAreaController.delete
);

routerStudentInterestArea.get(
  "/showStudentInterestArea",
  verifyTokenUser.verifyTokenADM,
  interestAreaController.show
);

export { routerStudentInterestArea };
