import { Request, Response, Router } from "express";
import { AddressController } from "../controllers/AddressController";
import { VerifyTokenAddress } from "../auth/middleware/address/verifyTokenAddress";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { Status } from "../env/status";

// criando um objeto de RoleController
const addressController = new AddressController();
const verifyTokenAddress = new VerifyTokenAddress();
const verifyTokenUser = new VerifyTokenUser();

const routerAddress = Router();

// criando a rota de cadastro de Roles
routerAddress.post(
  "/api/v1/address",
  verifyTokenAddress.verifyCreate,
  addressController.create
);

// criando a rota de atualização de Roles
routerAddress.put(
  "/api/v1/address",
  verifyTokenAddress.verifyUpdate,
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
  verifyTokenUser.verifyTokenAuth,
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
  verifyTokenUser.verifyTokenADM,
  addressController.delete
);

routerAddress.delete("/api/v1/address", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

// exportando o router
export { routerAddress };
