import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { UserRoleController } from "../controllers/UserRoleController";

const userRoleController = new UserRoleController();
const verifyTokenUser = new VerifyTokenUser();

const routerUserRole = Router();

// criando a rota de cadastro de userRoles
routerUserRole.post(
  "/userRole",
  verifyTokenUser.verifyTokenADM,
  userRoleController.create
);

// criando a rota de atualização de userRoles
routerUserRole.put(
  "/userRole",
  verifyTokenUser.verifyTokenADM,
  userRoleController.update
);

// criando a rota de listagem de todos as userRoles
routerUserRole.get(
  "/showUserRoles",
  verifyTokenUser.verifyTokenADM,
  userRoleController.show
);
// criando a rota de pesquisa da userRole pelo id
routerUserRole.get(
  "/userRole/:id",
  verifyTokenUser.verifyTokenADM,
  userRoleController.read
);

// criando a rota de deleção de userRoles
routerUserRole.delete(
  "/userRole/:id",
  verifyTokenUser.verifyTokenADM,
  userRoleController.delete
);

// exportando o router
export { routerUserRole };
