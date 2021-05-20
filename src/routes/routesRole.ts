import { Request, Response, Router } from "express";
import { RoleController } from "../controllers/RoleController";
import { Erros } from "../env/status";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";

// criando um objeto de RoleController
const roleController = new RoleController();
const verifyTokenUser = new VerifyTokenUser();

const routerRole = Router();

// criando a rota de cadastro de Roles
routerRole.post(
  "/api/v1/role",
  verifyTokenUser.verifyTokenADM,
  roleController.create
);

// criando a rota de atualização de Roles
routerRole.put(
  "/api/v1/role",
  verifyTokenUser.verifyTokenADM,
  roleController.update
);

// criando a rota de listagem de todos as Roles
routerRole.get(
  "/api/v1/showRoles",
  verifyTokenUser.verifyTokenADM,
  roleController.show
);
// criando a rota de pesquisa da Role pelo id
routerRole.get(
  "/api/v1/role/:id",
  verifyTokenUser.verifyTokenADM,
  roleController.read
);

routerRole.get("/api/v1/role", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Erros.ID_NOT_FOUND,
  });
});

// criando a rota de deleção de Roles
routerRole.delete(
  "/api/v1/role/:id",
  verifyTokenUser.verifyTokenADM,
  roleController.delete
);

routerRole.delete("/api/v1/role", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Erros.ID_NOT_FOUND,
  });
});

// exportando o router
export { routerRole };
