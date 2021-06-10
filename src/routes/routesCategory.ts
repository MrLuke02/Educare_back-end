import { Request, Response, Router } from "express";
import { PlanController } from "../controllers/PlanController";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { Status } from "../env/status";

// criando um objeto de RoleController
const planController = new PlanController();
const verifyTokenUser = new VerifyTokenUser();

const routerCategory = Router();

// criando a rota de cadastro de Roles
routerCategory.post(
  "/api/v1/category",
  verifyTokenUser.verifyTokenADM,
  planController.create
);

// criando a rota de atualização de Roles
routerCategory.put(
  "/api/v1/category",
  verifyTokenUser.verifyTokenADM,
  planController.update
);

// criando a rota de listagem de todos as Roles
routerCategory.get(
  "/api/v1/showCategories",
  verifyTokenUser.verifyTokenAuth,
  planController.show
);
// criando a rota de pesquisa da Role pelo id
routerCategory.get(
  "/api/v1/category/:id",
  verifyTokenUser.verifyTokenAuth,
  planController.read
);

routerCategory.get("/api/v1/category", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

// criando a rota de deleção de Roles
routerCategory.delete(
  "/api/v1/category/:id",
  verifyTokenUser.verifyTokenADM,
  planController.delete
);

routerCategory.delete("/api/v1/category", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

// exportando o router
export { routerCategory };
