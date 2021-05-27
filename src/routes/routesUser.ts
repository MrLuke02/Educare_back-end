import { Request, Response, Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { UserController } from "../controllers/UserController";
import { Status } from "../env/status";

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
// criando a rota de pesquisa da Role pelo id
routerUser.get(
  "/api/v1/userAddress/:userID",
  userController.readAddressFromUser
);
routerUser.get("/api/v1/userPhones/:userID", userController.readPhoneFromUser);
routerUser.get("/api/v1/userAll/:userID", userController.readAllFromUser);

routerUser.get("/api/v1/userAddress", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

routerUser.get("/api/v1/userPhones", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

routerUser.get("/api/v1/userAll", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

// criando a rota de deleção de usuários
routerUser.delete(
  "/api/v1/user/:id",
  verifyTokenUser.verifyDelete,
  userController.delete
);
routerUser.delete("/api/v1/user/", verifyTokenUser.verifyDelete);

// exportando o router
export { routerUser };
