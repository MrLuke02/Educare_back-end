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
  verifyTokenUser.verifyADMUser,
  userController.update
);

// criando a rota de listagem de todos os usuários
routerUser.get(
  "/showUsers",
  verifyTokenUser.verifyTokenADM,
  userController.showUsers
);

// criando a rota de pesquisa da Role pelo id
routerUser.get(
  "/userAddress/:userID",
  verifyTokenUser.verifyADMUser,
  userController.readAddressFromUser
);
routerUser.get("/userAddress", verifyTokenUser.verifyADMUser);

routerUser.get(
  "/userPhones/:userID",
  verifyTokenUser.verifyADMUser,
  userController.readPhonesFromUser
);
routerUser.get("/userPhones", verifyTokenUser.verifyADMUser);

routerUser.get(
  "/userCompanies/:userID",
  verifyTokenUser.verifyADMUser,
  userController.readCompaniesFromUser
);
routerUser.get("/userCompanies", verifyTokenUser.verifyADMUser);

routerUser.get(
  "/userOrders/:userID",
  verifyTokenUser.verifyADMUser,
  userController.readOrdersFromUser
);

routerUser.get(
  "/userSolicitations/:userID",
  verifyTokenUser.verifyADMUser,
  userController.readSolicitationsFromUser
);

routerUser.get(
  "/userAll/:userID",
  verifyTokenUser.verifyADMUser,
  userController.readAllFromUser
);
routerUser.get("/userAll", verifyTokenUser.verifyADMUser);

// criando a rota de deleção de usuários
routerUser.delete(
  "/user/:userID",
  verifyTokenUser.verifyADMUser,
  userController.delete
);
routerUser.delete("/user", verifyTokenUser.verifyADMUser);

// exportando o router
export { routerUser };
