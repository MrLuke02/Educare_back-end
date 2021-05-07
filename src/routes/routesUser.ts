import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { UserController } from "../controllers/UserController";

// criando um objeto de UserController
const userController = new UserController();
// criando um objeto de VerifyTokenUser
const verifyTokenUser = new VerifyTokenUser();

const routerUser = Router();

// criando a rota de cadastro de usuários
routerUser.post("/user", userController.create);
// criando a rota de autenticação de usuários
routerUser.post("/auth", userController.read);

// criando a rota de atualização de usuários
routerUser.put(
  "/userUpdate",
  verifyTokenUser.verifyUpdate,
  userController.update
);

// criando a rota de listagem de todos os usuários
routerUser.get(
  "/showUsers",
  verifyTokenUser.verifyShow,
  userController.showUsers
);

// criando a rota de deleção de usuários
routerUser.delete(
  "/user/:id",
  verifyTokenUser.verifyDelete,
  userController.delete
);

// exportando o router
export { routerUser };
