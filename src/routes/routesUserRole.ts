import { Request, Response, Router } from "express";
import { verifyTokenUserRole } from "../auth/middleware/userRole/verifyTokenUserRole";
import { UserRoleController } from "../controllers/UserRoleController";
import * as Erros from "../env/status";

const userRoleController = new UserRoleController();

const routerUserRole = Router();

// criando a rota de cadastro de userRoles
routerUserRole.post(
  "api/v1/userRole",
  verifyTokenUserRole,
  userRoleController.create
);

// criando a rota de atualização de userRoles
routerUserRole.put(
  "api/v1/userRole",
  verifyTokenUserRole,
  userRoleController.update
);

// criando a rota de listagem de todos as userRoles
routerUserRole.get(
  "api/v1/showUserRoles",
  verifyTokenUserRole,
  userRoleController.show
);
// criando a rota de pesquisa da userRole pelo id
routerUserRole.get(
  "api/v1/userRole/:id",
  verifyTokenUserRole,
  userRoleController.read
);

routerUserRole.get("api/v1/userRole", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Erros.ID_NOT_FOUND,
  });
});

// criando a rota de deleção de userRoles
routerUserRole.delete(
  "api/v1/userRole/:id",
  verifyTokenUserRole,
  userRoleController.delete
);

routerUserRole.delete("api/v1/userRole", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Erros.ID_NOT_FOUND,
  });
});

// exportando o router
export { routerUserRole };
