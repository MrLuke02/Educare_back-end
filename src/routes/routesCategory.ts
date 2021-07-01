import { Request, Response, Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { Status } from "../env/status";

// criando um objeto de RoleController
const categoryController = new CategoryController();
const verifyTokenUser = new VerifyTokenUser();

const routerCategory = Router();

// criando a rota de cadastro de Roles
routerCategory.post(
  "/category",
  verifyTokenUser.verifyTokenADM,
  categoryController.create
);

// criando a rota de atualização de Roles
routerCategory.put(
  "/category",
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

routerCategory.get("/category", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

// criando a rota de deleção de Roles
routerCategory.delete(
  "/category/:id",
  verifyTokenUser.verifyTokenADM,
  categoryController.delete
);

routerCategory.delete("/category", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

// exportando o router
export { routerCategory };
