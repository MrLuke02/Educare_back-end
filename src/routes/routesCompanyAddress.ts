import { Request, Response, Router } from "express";
import { CompanyAddressController } from "../controllers/CompanyAddressController";
import { VerifyTokenCompanyAddress } from "../auth/middleware/companyAddress/verifyTokenCompanyAddress";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { Status } from "../env/status";

// criando um objeto de RoleController
const companyAddressController = new CompanyAddressController();
const verifyTokenCompanyAddress = new VerifyTokenCompanyAddress();
const verifyTokenUser = new VerifyTokenUser();

const routerCompanyAddress = Router();

// criando a rota de cadastro de Roles
routerCompanyAddress.post(
  "/api/v1/companyAddress",
  verifyTokenCompanyAddress.verifyCreate,
  companyAddressController.create
);

// criando a rota de atualização de Roles
routerCompanyAddress.put(
  "/api/v1/companyAddress",
  verifyTokenCompanyAddress.verifyUpdate,
  companyAddressController.update
);

// criando a rota de listagem de todos as Roles
routerCompanyAddress.get(
  "/api/v1/showCompanyAddresses",
  verifyTokenUser.verifyTokenAuth,
  companyAddressController.show
);
// criando a rota de pesquisa da Role pelo id
routerCompanyAddress.get(
  "/api/v1/companyAddress/:id",
  verifyTokenUser.verifyTokenADM,
  companyAddressController.read
);

routerCompanyAddress.get(
  "/api/v1/companyAddress",
  (req: Request, res: Response) => {
    return res.status(422).json({
      Message: Status.ID_NOT_FOUND,
    });
  }
);

// criando a rota de deleção de Roles
routerCompanyAddress.delete(
  "/api/v1/companyAddress/:id",
  verifyTokenCompanyAddress.verifyDelete,
  companyAddressController.delete
);

routerCompanyAddress.delete(
  "/api/v1/companyAddress",
  (req: Request, res: Response) => {
    return res.status(422).json({
      Message: Status.ID_NOT_FOUND,
    });
  }
);

// exportando o router
export { routerCompanyAddress };
