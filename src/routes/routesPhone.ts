import { Request, Response, Router } from "express";
import { PhoneController } from "../controllers/PhoneController";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";

// criando um objeto de RoleController
const phoneController = new PhoneController();
const verifyTokenUser = new VerifyTokenUser();

const routerPhone = Router();

// criando a rota de cadastro de Roles
routerPhone.post(
  "/phone",
  verifyTokenUser.verifyADMUser,
  phoneController.create
);

// criando a rota de atualização de Roles
routerPhone.put(
  "/phone",
  verifyTokenUser.verifyADMUserByPhoneID,
  phoneController.update
);

// criando a rota de listagem de todos as Roles
routerPhone.get(
  "/showPhones",
  verifyTokenUser.verifyTokenADM,
  phoneController.show
);
// criando a rota de pesquisa da Role pelo id
routerPhone.get(
  "/phone/:id",
  verifyTokenUser.verifyTokenADM,
  phoneController.read
);

routerPhone.get("/phone", (req: Request, res: Response) => {
  throw new AppError(Message.ID_NOT_FOUND, 422);
});

// criando a rota de deleção de Roles
routerPhone.delete(
  "/phone/:id",
  verifyTokenUser.verifyADMUserByPhoneID,
  phoneController.delete
);

routerPhone.delete("/phone", verifyTokenUser.verifyADMUserByPhoneID);

// exportando o router
export { routerPhone };
