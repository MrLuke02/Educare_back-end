import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { InterestAreaController } from "../controllers/InterestAreaController";

const interestAreaController = new InterestAreaController();
const verifyTokenUser = new VerifyTokenUser();

const routerInterestArea = Router();

routerInterestArea.post(
  "/interestArea",
  verifyTokenUser.verifyTokenADM,
  interestAreaController.create
);

routerInterestArea.get(
  "/interestArea/:id",
  verifyTokenUser.verifyTokenAuth,
  interestAreaController.read
);

routerInterestArea.put(
  "/interestArea",
  verifyTokenUser.verifyTokenADM,
  interestAreaController.update
);

routerInterestArea.get(
  "/showInterestAreas",
  verifyTokenUser.verifyTokenAuth,
  interestAreaController.show
);

routerInterestArea.delete(
  "/interestArea/:id",
  verifyTokenUser.verifyTokenADM,
  interestAreaController.delete
);

export { routerInterestArea };
