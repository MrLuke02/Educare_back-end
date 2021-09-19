import { Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { AddressController } from "../controllers/AddressController";

// criando um objeto de RoleController
const addressController = new AddressController();
const verifyTokenUser = new VerifyTokenUser();

const routerAddress = Router();

// criando a rota de cadastro de Roles
routerAddress.post(
  "/address",
  verifyTokenUser.verifyADMUser,
  addressController.create
);

// criando a rota de atualização de Roles
routerAddress.put(
  "/address",
  verifyTokenUser.verifyADMUserByAddressID,
  addressController.update
);

// criando a rota de listagem de todos as Roles
routerAddress.get(
  "/showAddresses",
  verifyTokenUser.verifyTokenADM,
  addressController.show
);
// criando a rota de pesquisa da Role pelo id
routerAddress.get(
  "/address/:id",
  verifyTokenUser.verifyTokenADM,
  addressController.read
);

// criando a rota de deleção de Roles
routerAddress.delete(
  "/address/:id",
  verifyTokenUser.verifyADMUserByAddressID,
  addressController.delete
);

// exportando o router
export { routerAddress };
