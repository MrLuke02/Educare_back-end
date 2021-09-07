import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { UserInterestAreaController } from "../controllers/UserInterestAreaController";

const userInterestAreaController = new UserInterestAreaController();
const verifyTokenUser = new VerifyTokenUser();

const routerUserInterestArea = Router();

routerUserInterestArea.post(
  "/userInterestArea",
  verifyTokenUser.verifyTokenADM,
  userInterestAreaController.create
);

routerUserInterestArea.put(
  "/userInterestArea",
  verifyTokenUser.verifyTokenADM,
  userInterestAreaController.update
);

routerUserInterestArea.get(
  "/userInterestArea/:id",
  verifyTokenUser.verifyTokenADM,
  userInterestAreaController.read
);

routerUserInterestArea.delete(
  "/userInterestArea/:id",
  verifyTokenUser.verifyTokenADM,
  userInterestAreaController.delete
);

routerUserInterestArea.get(
  "/showUserInterestArea",
  verifyTokenUser.verifyTokenADM,
  userInterestAreaController.show
);

export { routerUserInterestArea };
