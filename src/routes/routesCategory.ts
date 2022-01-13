import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { CategoryController } from "../controllers/CategoryController";

// criando um objeto de RoleController
const categoryController = new CategoryController();
const verifyTokenUser = new VerifyTokenUser();

const routerCategory = Router();

// criando a rota de cadastro de Roles
routerCategory.post(
  "/plan",
  verifyTokenUser.verifyTokenADM,
  categoryController.create
);

// criando a rota de atualização de Roles
routerCategory.put(
  "/plan",
  verifyTokenUser.verifyTokenADM,
  categoryController.update
);

// criando a rota de listagem de todos as Roles
routerCategory.get(
  "/showCategories",
  verifyTokenUser.verifyTokenAuth,
  categoryController.show
);
// criando a rota de pesquisa da Role pelo id
routerCategory.get(
  "/category/:id",
  verifyTokenUser.verifyTokenAuth,
  categoryController.read
);

// criando a rota de deleção de Roles
routerCategory.delete(
  "/category/:id",
  verifyTokenUser.verifyTokenADM,
  categoryController.delete
);

// exportando o router
export { routerCategory };
