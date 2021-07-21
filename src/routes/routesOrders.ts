import { Router } from "express";
import multer from "multer";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { OrderController } from "../controllers/OrderController";

const routerOrder = Router();
const orderController = new OrderController();
const verifyTokenUser = new VerifyTokenUser();

// criando a rota de cadastro de usuários
routerOrder.post(
  "/order",
  multer().single("file"),
  verifyTokenUser.verifyTokenAuth,
  orderController.create
);

routerOrder.put(
  "/order",
  verifyTokenUser.verifyADMUserByOrderID,
  orderController.update
);

routerOrder.put(
  "/updateStatus",
  verifyTokenUser.verifyTokenADM,
  orderController.updateStatus
);

routerOrder.get(
  "/order/:id",
  verifyTokenUser.verifyADMUserByOrderID,
  orderController.read
);

routerOrder.get(
  "/showOrders",
  verifyTokenUser.verifyTokenADM,
  orderController.show
);

routerOrder.delete(
  "/order/:id",
  verifyTokenUser.verifyADMUserByOrderID,
  orderController.delete
);

// exportando o router
export { routerOrder };
