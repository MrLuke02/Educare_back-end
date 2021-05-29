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
  verifyTokenUser.verifyADMUser,
  userController.update
);

// criando a rota de listagem de todos os usuários
routerUser.get(
  "/api/v1/showUsers",
  verifyTokenUser.verifyTokenADM,
  userController.showUsers
);

// criando a rota de pesquisa da Role pelo id
routerUser.get(
  "/api/v1/userAddress/:userID",
  verifyTokenUser.verifyADMUser,
  userController.readAddressFromUser
);
routerUser.get("/api/v1/userAddress", verifyTokenUser.verifyADMUser);

routerUser.get(
  "/api/v1/userPhones/:userID",
  verifyTokenUser.verifyADMUser,
  userController.readPhoneFromUser
);
routerUser.get("/api/v1/userPhones", verifyTokenUser.verifyADMUser);

routerUser.get(
  "/api/v1/userCompany/:userID",
  verifyTokenUser.verifyADMUser,
  userController.readCompanyFromUser
);
routerUser.get("/api/v1/userCompany", verifyTokenUser.verifyADMUser);

routerUser.get(
  "/api/v1/userAll/:userID",
  verifyTokenUser.verifyADMUser,
  userController.readAllFromUser
);
routerUser.get("/api/v1/userAll", verifyTokenUser.verifyADMUser);

// criando a rota de deleção de usuários
routerUser.delete(
  "/api/v1/user/:userID",
  verifyTokenUser.verifyADMUser,
  userController.delete
);
routerUser.delete("/api/v1/user", verifyTokenUser.verifyADMUser);

// exportando o router
export { routerUser };
