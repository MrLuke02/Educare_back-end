import { Request, Response, Router } from "express";
import { PhoneController } from "../controllers/PhoneController";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { Status } from "../env/status";

// criando um objeto de RoleController
const phoneController = new PhoneController();
const verifyTokenUser = new VerifyTokenUser();

const routerPhone = Router();

// criando a rota de cadastro de Roles
routerPhone.post(
  "/api/v1/phone",
  verifyTokenUser.verifyTokenADM,
  phoneController.create
);

// criando a rota de atualização de Roles
routerPhone.put(
  "/api/v1/phone",
  verifyTokenUser.verifyTokenADM,
  phoneController.update
);

// criando a rota de listagem de todos as Roles
routerPhone.get(
  "/api/v1/showPhones",
  verifyTokenUser.verifyTokenADM,
  phoneController.show
);
// criando a rota de pesquisa da Role pelo id
routerPhone.get(
  "/api/v1/phone/:id",
  verifyTokenUser.verifyTokenAuth,
  phoneController.readFromId
);

routerPhone.get("/api/v1/phone", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

// criando a rota de deleção de Roles
routerPhone.delete(
  "/api/v1/phone/:id",
  verifyTokenUser.verifyTokenADM,
  phoneController.delete
);

routerPhone.delete("/api/v1/phone", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

// exportando o router
export { routerPhone };
