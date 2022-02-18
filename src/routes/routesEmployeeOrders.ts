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
  verifyTokenUser.verifyADMUserByOrderID,
  employeeOrderController.update
);

routerEmployeeOrder.put(
  "/employeeOrderStatus",
  verifyTokenUser.verifyADMUserByOrderID,
  employeeOrderController.updateStatus
);

routerEmployeeOrder.get(
  "/employeeOrder/:id",
  verifyTokenUser.verifyADMUserByOrderID,
  employeeOrderController.read
);

routerEmployeeOrder.get(
  "/showEmployeeOrders",
  verifyTokenUser.verifyTokenADM,
  employeeOrderController.show
);

routerEmployeeOrder.delete(
  "/employeeOrder/:id",
  verifyTokenUser.verifyADMUserByOrderID,
  employeeOrderController.delete
);

routerEmployeeOrder.get(
  "/companyHistoric/:companyID",
  verifyTokenUser.verifyADMUserByOrderID,
  employeeOrderController.readOrdersCompany
);

// exportando o router
export { routerEmployeeOrder };
