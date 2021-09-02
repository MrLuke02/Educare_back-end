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

routerInterestArea.put(
  "/interestArea",
  verifyTokenUser.verifyTokenADM,
  interestAreaController.update
);

routerInterestArea.get(
  "/interestArea/:id",
  verifyTokenUser.verifyTokenADM,
  interestAreaController.read
);

routerInterestArea.delete(
  "/interestArea/:id",
  verifyTokenUser.verifyTokenADM,
  interestAreaController.delete
);

routerInterestArea.get(
  "/showInterestArea",
  verifyTokenUser.verifyTokenADM,
  interestAreaController.show
);

export { routerInterestArea };
