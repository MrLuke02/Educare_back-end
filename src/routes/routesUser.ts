import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { UserController } from "../controllers/UserController";

// criando um objeto de UserController
const userController = new UserController();
// criando um objeto de VerifyTokenUser
const verifyTokenUser = new VerifyTokenUser();

const routerUser = Router();

// criando a rota de cadastro de usuários
routerUser.post("/api/v1/user", userController.create);
// criando a rota de autenticação de usuários
routerUser.post("/api/v1/auth", userController.read);

// criando a rota de atualização de usuários
routerUser.put(
  "/api/v1/userUpdate",
  verifyTokenUser.verifyUpdate,
  userController.update
);

// criando a rota de listagem de todos os usuários
routerUser.get(
  "/api/v1/showUsers",
  verifyTokenUser.verifyShow,
  userController.showUsers
);

// criando a rota de deleção de usuários
routerUser.delete(
  "/api/v1/user/:id",
  verifyTokenUser.verifyDelete,
  userController.delete
);
routerUser.delete("/api/v1/user/", verifyTokenUser.verifyDelete);

// exportando o router
export { routerUser };
