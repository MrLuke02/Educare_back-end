import { Router } from "express";

import { OrderStatusController } from "../controllers/OrderStatusController";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";

const orderStatusController = new OrderStatusController();
const verifyTokenUser = new VerifyTokenUser();

const routerOrderStatus = Router();

routerOrderStatus.post(
  "/orderStatus",
  verifyTokenUser.verifyTokenADM,
  orderStatusController.create
);

routerOrderStatus.get(
  "/orderStatus/:id",
  verifyTokenUser.verifyTokenADM,
  orderStatusController.read
);

routerOrderStatus.get(
  "/showOrderStatus",
  verifyTokenUser.verifyTokenADM,
  orderStatusController.show
);

routerOrderStatus.put(
  "/orderStatus",
  verifyTokenUser.verifyTokenADM,
  orderStatusController.update
);

routerOrderStatus.delete(
  "/orderStatus/:id",
  verifyTokenUser.verifyTokenADM,
  orderStatusController.delete
);

export { routerOrderStatus };
