import { Request, Response, Router } from "express";
import { PlanController } from "../controllers/PlanController";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { Erros } from "../env/status";

// criando um objeto de RoleController
const planController = new PlanController();
const verifyTokenUser = new VerifyTokenUser();

const routerPlan = Router();

// criando a rota de cadastro de Roles
routerPlan.post(
  "/api/v1/plan",
  verifyTokenUser.verifyTokenADM,
  planController.create
);

// criando a rota de atualização de Roles
routerPlan.put(
  "/api/v1/plan",
  verifyTokenUser.verifyTokenADM,
  planController.update
);

// criando a rota de listagem de todos as Roles
routerPlan.get(
  "/api/v1/showPlans",
  verifyTokenUser.verifyTokenAuth,
  planController.show
);
// criando a rota de pesquisa da Role pelo id
routerPlan.get(
  "/api/v1/plan/:id",
  verifyTokenUser.verifyTokenAuth,
  planController.read
);

routerPlan.get("/api/v1/plan", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Erros.ID_NOT_FOUND,
  });
});

// criando a rota de deleção de Roles
routerPlan.delete(
  "/api/v1/plan/:id",
  verifyTokenUser.verifyTokenADM,
  planController.delete
);

routerPlan.delete("/api/v1/plan", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Erros.ID_NOT_FOUND,
  });
});

// exportando o router
export { routerPlan };
