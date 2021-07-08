import { Request, Response, Router } from "express";
import multer from "multer";
import { OrderController } from "../controllers/OrderController";
import { Status } from "../env/status";

const routerOrder = Router();
const orderController = new OrderController();
// criando a rota de cadastro de usuários
routerOrder.post("/order", multer().single("file"), orderController.create);

routerOrder.put("/order", multer().single("file"), orderController.update);

routerOrder.get("/order/:id", orderController.read);
routerOrder.get("/order", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

routerOrder.get("/showOrders", orderController.show);

routerOrder.get("/order", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

routerOrder.delete("/order/:id", orderController.delete);

routerOrder.delete("/order", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

// exportando o router
export { routerOrder };
