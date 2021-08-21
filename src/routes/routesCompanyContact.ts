import { Request, Response, Router } from "express";
import { CompanyContactController } from "../controllers/CompanyContactController";
import { VerifyTokenCompany } from "../auth/middleware/company/verifyTokenCompany";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";

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
routerCompanyContact.get("/companyContact/", (req: Request, res: Response) => {
  throw new AppError(Message.ID_NOT_FOUND, 422);
});
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
routerCompanyContact.delete(
  "/companyContact/",
  verifyTokenCompany.verifyADMCompanyByContactID
);

export { routerCompanyContact };
