import { Request, Response, Router } from "express";
import { CompanyContactController } from "../controllers/CompanyContactController";
import { VerifyTokenCompany } from "../auth/middleware/company/verifyTokenCompany";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { Status } from "../env/status";

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

routerCompanyContact.get(
  "/companyContact/:id",
  verifyTokenUser.verifyTokenADM,
  companyContactController.read
);
routerCompanyContact.get("/companyContact/", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});
routerCompanyContact.get(
  "/showCompaniesContacts",
  verifyTokenUser.verifyTokenADM,
  companyContactController.show
);

routerCompanyContact.put(
  "/companyContact",
  verifyTokenCompany.verifyADMCompanyByContactID,
  companyContactController.update
);

routerCompanyContact.delete(
  "/companyContact/:id",
  verifyTokenCompany.verifyADMCompanyByContactID,
  companyContactController.delete
);
routerCompanyContact.delete(
  "/companyContact/",
  verifyTokenCompany.verifyADMCompanyByContactID
);

export { routerCompanyContact };
