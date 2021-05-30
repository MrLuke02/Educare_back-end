import { Request, Response, Router } from "express";
import { VerifyTokenCompany } from "../auth/middleware/company/verifyTokenCompany";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { CompanyAddressController } from "../controllers/CompanyAddressController";
import { Status } from "../env/status";

// criando um objeto de RoleController
const companyAddressController = new CompanyAddressController();
const verifyTokenUser = new VerifyTokenUser();
const verifyTokenCompany = new VerifyTokenCompany();

const routerCompanyAddress = Router();

// criando a rota de cadastro de Roles
routerCompanyAddress.post(
  "/api/v1/companyAddress",
  verifyTokenCompany.verifyADMCompany,
  companyAddressController.create
);

// criando a rota de atualização de Roles
routerCompanyAddress.put(
  "/api/v1/companyAddress",
  verifyTokenCompany.verifyADMCompanyByAddressID,
  companyAddressController.update
);

// criando a rota de listagem de todos as Roles
routerCompanyAddress.get(
  "/api/v1/showCompanyAddresses",
  verifyTokenUser.verifyTokenADM,
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
  verifyTokenCompany.verifyADMCompanyByAddressID,
  companyAddressController.delete
);

routerCompanyAddress.delete(
  "/api/v1/companyAddress",
  verifyTokenCompany.verifyADMCompanyByAddressID
);

// exportando o router
export { routerCompanyAddress };
