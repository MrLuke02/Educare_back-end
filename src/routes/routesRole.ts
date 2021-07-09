import { Request, Response, Router } from "express";
import { RoleController } from "../controllers/RoleController";
import { Message } from "../env/message";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { AppError } from "../errors/AppErrors";

// criando um objeto de RoleController
const roleController = new RoleController();
const verifyTokenUser = new VerifyTokenUser();

const routerRole = Router();

// criando a rota de cadastro de Roles
routerRole.post("/role", verifyTokenUser.verifyTokenADM, roleController.create);

// criando a rota de atualização de Roles
routerRole.put("/role", verifyTokenUser.verifyTokenADM, roleController.update);

// criando a rota de listagem de todos as Roles
routerRole.get(
  "/showRoles",
  verifyTokenUser.verifyTokenADM,
  roleController.show
);
// criando a rota de pesquisa da Role pelo id
routerRole.get(
  "/role/:id",
  verifyTokenUser.verifyTokenADM,
  roleController.read
);

routerRole.get("/role", (req: Request, res: Response) => {
  throw new AppError(Message.ID_NOT_FOUND, 422);
});

// criando a rota de deleção de Roles
routerRole.delete(
  "/role/:id",
  verifyTokenUser.verifyTokenADM,
  roleController.delete
);

routerRole.delete("/role", (req: Request, res: Response) => {
  throw new AppError(Message.ID_NOT_FOUND, 422);
});

// exportando o router
export { routerRole };
