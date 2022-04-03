import { Router } from "express";
import multer from "multer";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { EmployeeOrderController } from "../controllers/EmployeeOrderController";

const routerEmployeeOrder = Router();
const employeeOrderController = new EmployeeOrderController();
const verifyTokenUser = new VerifyTokenUser();

// criando a rota de cadastro de usuários
routerEmployeeOrder.post(
  "/employeeOrder",
  multer().single("file"),
  verifyTokenUser.verifyTokenAuth,
  employeeOrderController.create
);

routerEmployeeOrder.put(
  "/employeeOrder",
  verifyTokenUser.verifyTokenAuth,
  employeeOrderController.update
);

routerEmployeeOrder.put(
  "/employeeOrderStatus",
  verifyTokenUser.verifyTokenAuth,
  employeeOrderController.updateStatus
);

routerEmployeeOrder.get(
  "/employeeOrder/:id",
  verifyTokenUser.verifyTokenAuth,
  employeeOrderController.read
);

routerEmployeeOrder.get(
  "/showEmployeeOrders",
  verifyTokenUser.verifyTokenAuth,
  employeeOrderController.show
);

routerEmployeeOrder.delete(
  "/employeeOrder/:id",
  verifyTokenUser.verifyTokenAuth,
  employeeOrderController.delete
);

routerEmployeeOrder.get(
  "/companyHistoric/:companyID",
  verifyTokenUser.verifyTokenAuth,
  employeeOrderController.readOrdersCompany
);

routerEmployeeOrder.get(
  "/ordersUser/:userID/:companyID",
  verifyTokenUser.verifyTokenAuth,
  employeeOrderController.readOrdersByUserID
);

// exportando o router
export { routerEmployeeOrder };
