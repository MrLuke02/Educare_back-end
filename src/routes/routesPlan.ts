import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { PlanController } from "../controllers/PlanController";

// criando um objeto de RoleController
const planController = new PlanController();
const verifyTokenUser = new VerifyTokenUser();

const routerPlan = Router();

// criando a rota de cadastro de Roles
routerPlan.post("/plan", verifyTokenUser.verifyTokenADM, planController.create);

// criando a rota de atualização de Roles
routerPlan.put("/plan", verifyTokenUser.verifyTokenADM, planController.update);

// criando a rota de listagem de todos as Roles
routerPlan.get(
  "/showPlans",
  verifyTokenUser.verifyTokenAuth,
  planController.show
);
// criando a rota de pesquisa da Role pelo id
routerPlan.get(
  "/plan/:id",
  verifyTokenUser.verifyTokenAuth,
  planController.read
);

// criando a rota de deleção de Roles
routerPlan.delete(
  "/plan/:id",
  verifyTokenUser.verifyTokenADM,
  planController.delete
);

// exportando o router
export { routerPlan };
