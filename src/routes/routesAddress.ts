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
  "/showAddress",
  verifyTokenUser.verifyTokenADM,
  addressController.show
);
// criando a rota de pesquisa da Role pelo id
routerAddress.get(
  "/address/:id",
  verifyTokenUser.verifyTokenADM,
  addressController.read
);
routerAddress.get("/address", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

// criando a rota de deleção de Roles
routerAddress.delete(
  "/address/:id",
  verifyTokenUser.verifyADMUserByAddressID,
  addressController.delete
);

routerAddress.delete("/address", verifyTokenUser.verifyADMUserByAddressID);

// exportando o router
export { routerAddress };
