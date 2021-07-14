import { Router } from "express";
import multer from "multer";
import { SolicitationController } from "../controllers/SolicitationController";

const solicitationController = new SolicitationController();

const routerSolicitation = Router();

routerSolicitation.post(
  "/solicitation",
  multer().single("file"),
  solicitationController.create
);

routerSolicitation.get("/solicitation/:id", solicitationController.read);

routerSolicitation.put("/solicitation", solicitationController.updateStatus);

routerSolicitation.get("/showSolicitations", solicitationController.show);

routerSolicitation.delete("/solicitation/:id", solicitationController.delete);

export { routerSolicitation };
