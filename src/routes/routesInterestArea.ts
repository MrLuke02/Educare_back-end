import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { InterestAreaController } from "../controllers/InterestAreaController";

const courseController = new InterestAreaController();
const verifyTokenUser = new VerifyTokenUser();

const routerInterestArea = Router();

routerInterestArea.post(
  "/course",
  verifyTokenUser.verifyTokenADM,
  courseController.create
);

routerInterestArea.put(
  "/course",
  verifyTokenUser.verifyTokenADM,
  courseController.update
);

routerInterestArea.get(
  "/course/:id",
  verifyTokenUser.verifyTokenADM,
  courseController.read
);

routerInterestArea.delete(
  "/course/:id",
  verifyTokenUser.verifyTokenADM,
  courseController.delete
);

routerInterestArea.get(
  "/showCourses",
  verifyTokenUser.verifyTokenADM,
  courseController.show
);

export { routerInterestArea };
