import { Router } from "express";

import { EmployeeController } from "../controllers/EmployeeController";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { VerifyTokenCompany } from "../auth/middleware/company/verifyTokenCompany";

// criando um objeto de UserController
const employeeController = new EmployeeController();
const verifyTokenCompany = new VerifyTokenCompany();
// criando um objeto de VerifyTokenUser
const verifyTokenUser = new VerifyTokenUser();

const routerEmployee = Router();

// criando a rota de cadastro de usuários
routerEmployee.post(
  "/employee",
  verifyTokenCompany.verifyADMCompany,
  employeeController.create
);

// criando a rota de atualização de funcionários
routerEmployee.put(
  "/employee",
  verifyTokenUser.verifyADMUserCompanyByEmployeeID,
  employeeController.update
);

// criando a rota de listagem de todos os funcionários
routerEmployee.get(
  "/showEmployee",
  verifyTokenUser.verifyTokenADM,
  employeeController.show
);

// criando a rota de pesquisa do funcionário pelo id
routerEmployee.get(
  "/employee/:id",
  verifyTokenUser.verifyADMUserCompanyByEmployeeID,
  employeeController.read
);

routerEmployee.get(
  "/employees/:companyID",
  employeeController.readUserFromCompanyID
);

// criando a rota de deleção de funcionários
routerEmployee.delete(
  "/employee/:id",
  verifyTokenUser.verifyADMUserCompanyByEmployeeID,
  employeeController.delete
);

// exportando o router
export { routerEmployee };
