import { Request, Response, Router } from "express";
import { CompanyContactController } from "../controllers/CompanyContactController";
import { VerifyTokenCompany } from "../auth/middleware/company/verifyTokenCompany";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { Status } from "../env/status";

// criando um objeto de RoleController
const companyContactController = new CompanyContactController();
const verifyTokenCompany = new VerifyTokenCompany();
const verifyTokenUser = new VerifyTokenUser();

const routesCompanyContact = Router();

routesCompanyContact.post(
  "/api/v1/companyContact",
  verifyTokenCompany.verifyADMCompany,
  companyContactController.create
);

routesCompanyContact.get(
  "/api/v1/companyContact/:id",
  verifyTokenUser.verifyTokenADM,
  companyContactController.read
);
routesCompanyContact.get(
  "/api/v1/companyContact/",
  (req: Request, res: Response) => {
    return res.status(422).json({
      Message: Status.ID_NOT_FOUND,
    });
  }
);
routesCompanyContact.get(
  "/api/v1/showCompaniesContacts",
  verifyTokenUser.verifyTokenADM,
  companyContactController.show
);

routesCompanyContact.put(
  "/api/v1/companyContact",
  verifyTokenCompany.verifyADMCompanyByContactID,
  companyContactController.update
);

routesCompanyContact.delete(
  "/api/v1/companyContact/:id",
  verifyTokenCompany.verifyADMCompanyByContactID,
  companyContactController.delete
);
routesCompanyContact.delete(
  "/api/v1/companyContact/",
  verifyTokenCompany.verifyADMCompanyByContactID
);

export { routesCompanyContact };
