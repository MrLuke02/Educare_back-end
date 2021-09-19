import { Router } from "express";
import { VerifyTokenCompany } from "../auth/middleware/company/verifyTokenCompany";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { CompanyContactController } from "../controllers/CompanyContactController";

// criando um objeto de RoleController
const companyContactController = new CompanyContactController();
const verifyTokenCompany = new VerifyTokenCompany();
const verifyTokenUser = new VerifyTokenUser();

const routerCompanyContact = Router();

routerCompanyContact.post(
  "/companyContact",
  verifyTokenCompany.verifyADMCompany,
  companyContactController.create
);

routerCompanyContact.put(
  "/companyContact",
  verifyTokenCompany.verifyADMCompanyByContactID,
  companyContactController.update
);

routerCompanyContact.get(
  "/companyContact/:id",
  verifyTokenUser.verifyTokenADM,
  companyContactController.read
);

routerCompanyContact.get(
  "/showCompanyContacts",
  verifyTokenUser.verifyTokenADM,
  companyContactController.show
);

routerCompanyContact.delete(
  "/companyContact/:id",
  verifyTokenCompany.verifyADMCompanyByContactID,
  companyContactController.delete
);

export { routerCompanyContact };
