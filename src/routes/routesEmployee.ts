import { Router } from "express";

import { EmployeeController } from "../controllers/EmployeeController";

// criando um objeto de UserController
const employeeController = new EmployeeController();

const routerEmployee = Router();

// criando a rota de cadastro de usuários
routerEmployee.post("/employee", employeeController.create);

// criando a rota de atualização de usuários
routerEmployee.put("/employee", employeeController.update);

// criando a rota de listagem de todos os usuários
routerEmployee.get("/showEmployee", employeeController.show);

// criando a rota de pesquisa da Role pelo id
routerEmployee.get("/employee/:id", employeeController.read);

// criando a rota de deleção de usuários
routerEmployee.delete("/employee/:id", employeeController.delete);

// exportando o router
export { routerEmployee };
