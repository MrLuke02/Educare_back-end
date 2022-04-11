import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { UserInterestAreaRelationUserController } from "../controllers/UserInterestAreaRelationUserController";

const userInterestAreaRelationUserController =
  new UserInterestAreaRelationUserController();
const verifyTokenUser = new VerifyTokenUser();

const routerUserInterestAreaRelationUser = Router();

// criando a rota de cadastro de userRoles
routerUserInterestAreaRelationUser.post(
  "/userInterestAreaRelationUser",
  verifyTokenUser.verifyTokenADM,
  userInterestAreaRelationUserController.create
);

// criando a rota de listagem de todos as userRoles
routerUserInterestAreaRelationUser.get(
  "/showUserInterestAreaRelationUser",
  verifyTokenUser.verifyTokenADM,
  userInterestAreaRelationUserController.show
);
// criando a rota de pesquisa da userRole pelo id
routerUserInterestAreaRelationUser.get(
  "/userInterestAreaRelationUser/:id",
  verifyTokenUser.verifyTokenADM,
  userInterestAreaRelationUserController.read
);

// criando a rota de deleção de userRoles
routerUserInterestAreaRelationUser.delete(
  "/userInterestAreaRelationUser/:id",
  verifyTokenUser.verifyTokenADM,
  userInterestAreaRelationUserController.delete
);

// exportando o router
export { routerUserInterestAreaRelationUser };
