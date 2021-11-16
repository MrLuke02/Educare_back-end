import { Router } from "express";
import multer from "multer";

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
  multer().single("image"),
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

routerUser.get(
  "/userPhones/:userID",
  verifyTokenUser.verifyADMUser,
  userController.readPhonesFromUser
);

routerUser.get(
  "/userCompanies/:userID",
  verifyTokenUser.verifyADMUser,
  userController.readCompaniesFromUser
);

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

routerUser.get(
  "/userInterestAreas/:userID",
  verifyTokenUser.verifyADMUser,
  userController.readUserInterestArea
);

// criando a rota de deleção de usuários
routerUser.delete(
  "/user/:userID",
  verifyTokenUser.verifyADMUser,
  userController.delete
);

// exportando o router
export { routerUser };
