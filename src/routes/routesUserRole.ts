import { Router } from "express";
import { verifyTokenUserRole } from "../auth/middleware/userRole/verifyTokenUserRole";
import { UserRoleController } from "../controllers/UserRoleController";

const userRoleController = new UserRoleController();

const routerUserRole = Router();

// criando a rota de cadastro de userRoles
routerUserRole.post(
  "/userRole",
  verifyTokenUserRole,
  userRoleController.create
);

// criando a rota de atualização de userRoles
routerUserRole.put("/userRole", verifyTokenUserRole, userRoleController.update);

// criando a rota de listagem de todos as userRoles
routerUserRole.get(
  "/showUserRoles",
  verifyTokenUserRole,
  userRoleController.show
);
// criando a rota de pesquisa da userRole pelo id
routerUserRole.get(
  "/userRole/:id",
  verifyTokenUserRole,
  userRoleController.read
);

// criando a rota de deleção de userRoles
routerUserRole.delete(
  "/userRole/:id",
  verifyTokenUserRole,
  userRoleController.delete
);

// exportando o router
export { routerUserRole };
