import { Request, Response, Router } from "express";
import { verifyTokenRole } from "../auth/middleware/role/verifyTokenRole";
import { RoleController } from "../controllers/RoleController";
import * as Erros from "../env/status";

// criando um objeto de RoleController
const roleController = new RoleController();

const routerRole = Router();

// criando a rota de cadastro de Roles
routerRole.post("api/v1/role", verifyTokenRole, roleController.create);

// criando a rota de atualização de Roles
routerRole.put("api/v1/role", verifyTokenRole, roleController.update);

// criando a rota de listagem de todos as Roles
routerRole.get("api/v1/showRoles", verifyTokenRole, roleController.show);
// criando a rota de pesquisa da Role pelo id
routerRole.get("api/v1/role/:id", verifyTokenRole, roleController.read);

routerRole.get("api/v1/role", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Erros.ID_NOT_FOUND,
  });
});

// criando a rota de deleção de Roles
routerRole.delete("api/v1/role/:id", verifyTokenRole, roleController.delete);

routerRole.delete("api/v1/role", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Erros.ID_NOT_FOUND,
  });
});

// exportando o router
export { routerRole };
