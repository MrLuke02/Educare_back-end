import { Router } from "express";
import { VerifyTokenCompany } from "../auth/middleware/company/verifyTokenCompany";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { CompanyAddressController } from "../controllers/CompanyAddressController";

// criando um objeto de RoleController
const companyAddressController = new CompanyAddressController();
const verifyTokenUser = new VerifyTokenUser();
const verifyTokenCompany = new VerifyTokenCompany();

const routerCompanyAddress = Router();

// criando a rota de cadastro de Roles
routerCompanyAddress.post(
  "/companyAddress",
  verifyTokenCompany.verifyADMCompany,
  companyAddressController.create
);

// criando a rota de atualização de Roles
routerCompanyAddress.put(
  "/companyAddress",
  verifyTokenCompany.verifyADMCompanyByAddressID,
  companyAddressController.update
);

// criando a rota de listagem de todos as Roles
routerCompanyAddress.get(
  "/showCompanyAddresses",
  verifyTokenUser.verifyTokenADM,
  companyAddressController.show
);
// criando a rota de pesquisa da Role pelo id
routerCompanyAddress.get(
  "/companyAddress/:id",
  verifyTokenUser.verifyTokenADM,
  companyAddressController.read
);

// criando a rota de deleção de Roles
routerCompanyAddress.delete(
  "/companyAddress/:id",
  verifyTokenCompany.verifyADMCompanyByAddressID,
  companyAddressController.delete
);

// exportando o router
export { routerCompanyAddress };
