import { Request, Response, Router } from "express";
import multer from "multer";
import { OrderController } from "../controllers/OrderController";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";

const routerOrder = Router();
const orderController = new OrderController();
// criando a rota de cadastro de usuários
routerOrder.post("/order", multer().single("file"), orderController.create);

routerOrder.put("/order", orderController.update);

routerOrder.get("/order/:id", orderController.read);
routerOrder.get("/order", (req: Request, res: Response) => {
  throw new AppError(Message.ID_NOT_FOUND, 422);
});

routerOrder.get("/showOrders", orderController.show);

routerOrder.delete("/order/:id", orderController.delete);
routerOrder.delete("/order", (req: Request, res: Response) => {
  throw new AppError(Message.ID_NOT_FOUND, 422);
});

// exportando o router
export { routerOrder };
