import { Request, Response, Router } from "express";
import { UserRoleController } from "../controllers/UserRoleController";
import * as Erros from "../env/status";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";

const userRoleController = new UserRoleController();
const verifyTokenUser = new VerifyTokenUser();

const routerUserRole = Router();

// criando a rota de cadastro de userRoles
routerUserRole.post(
  "/api/v1/userRole",
  verifyTokenUser.verifyTokenADM,
  userRoleController.create
);

// criando a rota de atualização de userRoles
routerUserRole.put(
  "/api/v1/userRole",
  verifyTokenUser.verifyTokenADM,
  userRoleController.update
);

// criando a rota de listagem de todos as userRoles
routerUserRole.get(
  "/api/v1/showUserRoles",
  verifyTokenUser.verifyTokenADM,
  userRoleController.show
);
// criando a rota de pesquisa da userRole pelo id
routerUserRole.get(
  "/api/v1/userRole/:id",
  verifyTokenUser.verifyTokenADM,
  userRoleController.read
);

routerUserRole.get("/api/v1/userRole", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Erros.ID_NOT_FOUND,
  });
});

// criando a rota de deleção de userRoles
routerUserRole.delete(
  "/api/v1/userRole/:id",
  verifyTokenUser.verifyTokenADM,
  userRoleController.delete
);

routerUserRole.delete("/api/v1/userRole", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Erros.ID_NOT_FOUND,
  });
});

// exportando o router
export { routerUserRole };
