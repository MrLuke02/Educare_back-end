import { Router } from "express";
import { InterestAreaController } from "../controllers/InterestAreaController";

const interestAreaController = new InterestAreaController();

const routerInterestArea = Router();

routerInterestArea.post("/interestArea", interestAreaController.create);

routerInterestArea.get("/interestArea/:id", interestAreaController.read);

routerInterestArea.put("/interestArea", interestAreaController.update);

routerInterestArea.get("/showInterestAreas", interestAreaController.show);

routerInterestArea.delete("/interestArea/:id", interestAreaController.delete);

export { routerInterestArea };
