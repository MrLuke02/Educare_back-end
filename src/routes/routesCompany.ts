import { Router } from "express";
import { VerifyTokenCompany } from "../auth/middleware/company/verifyTokenCompany";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { CompanyController } from "../controllers/CompanyController";

// criando um objeto de RoleController
const companyController = new CompanyController();
const verifyTokenCompany = new VerifyTokenCompany();
const verifyTokenUser = new VerifyTokenUser();

const routerCompany = Router();

routerCompany.post(
  "/company",
  verifyTokenUser.verifyTokenADM,
  companyController.create
);

routerCompany.put(
  "/company",
  verifyTokenCompany.verifyADMCompany,
  companyController.update
);

routerCompany.get(
  "/companyByCpnj/:cnpj",
  verifyTokenUser.verifyTokenAuth,
  companyController.read
);

routerCompany.get(
  "/companiesByCategory/:companyCategory",
  verifyTokenUser.verifyTokenAuth,
  companyController.readFromCategory
);

routerCompany.get(
  "/company/:companyID",
  verifyTokenCompany.verifyADMCompany,
  companyController.readFromID
);

routerCompany.get(
  "/companyAll/:companyID",
  verifyTokenUser.verifyTokenAuth,
  companyController.readAllFromCompany
);

// criando a rota de pesquisa da Role pelo id
routerCompany.get(
  "/companyAddress/:companyID",
  verifyTokenCompany.verifyADMCompany,
  companyController.readCompanyAddress
);

routerCompany.get(
  "/companyContact/:companyID",
  verifyTokenCompany.verifyADMCompany,
  companyController.readCompanyContact
);

routerCompany.get(
  "/showCompanies",
  verifyTokenUser.verifyTokenAuth,
  companyController.show
);

routerCompany.delete(
  "/company/:companyID",
  verifyTokenCompany.verifyADMCompany,
  companyController.delete
);

export { routerCompany };
