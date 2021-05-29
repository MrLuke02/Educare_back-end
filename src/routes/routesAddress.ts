import { Request, Response, Router } from "express";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { AddressController } from "../controllers/AddressController";
import { Status } from "../env/status";

// criando um objeto de RoleController
const addressController = new AddressController();
const verifyTokenUser = new VerifyTokenUser();

const routerAddress = Router();

// criando a rota de cadastro de Roles
routerAddress.post(
  "/api/v1/address",
  verifyTokenUser.verifyADMUser,
  addressController.create
);

// criando a rota de atualização de Roles
routerAddress.put(
  "/api/v1/address",
  verifyTokenUser.verifyADMUserByAddressID,
  addressController.update
);

// criando a rota de listagem de todos as Roles
routerAddress.get(
  "/api/v1/showAddress",
  verifyTokenUser.verifyTokenADM,
  addressController.show
);
// criando a rota de pesquisa da Role pelo id
routerAddress.get(
  "/api/v1/address/:id",
  verifyTokenUser.verifyTokenADM,
  addressController.read
);
routerAddress.get("/api/v1/address", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

// criando a rota de deleção de Roles
routerAddress.delete(
  "/api/v1/address/:id",
  verifyTokenUser.verifyADMUserByAddressID,
  addressController.delete
);

routerAddress.delete(
  "/api/v1/address",
  verifyTokenUser.verifyADMUserByAddressID
);

// exportando o router
export { routerAddress };
