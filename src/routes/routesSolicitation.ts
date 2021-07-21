import { Router } from "express";
import multer from "multer";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { SolicitationController } from "../controllers/SolicitationController";

const solicitationController = new SolicitationController();
const verifyTokenUser = new VerifyTokenUser();

const routerSolicitation = Router();

routerSolicitation.post(
  "/solicitation",
  multer().single("file"),
  verifyTokenUser.verifyTokenAuth,
  solicitationController.create
);

routerSolicitation.get(
  "/solicitation/:id",
  verifyTokenUser.verifyTokenADM,
  solicitationController.read
);

routerSolicitation.put(
  "/solicitation",
  verifyTokenUser.verifyTokenADM,
  solicitationController.updateStatus
);

routerSolicitation.get(
  "/showSolicitations",
  verifyTokenUser.verifyTokenADM,
  solicitationController.show
);

routerSolicitation.delete(
  "/solicitation/:id",
  verifyTokenUser.verifyADMUserBySolicitationID,
  solicitationController.delete
);

export { routerSolicitation };
