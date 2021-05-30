import { Request, Response, Router } from "express";
import { VerifyTokenCompany } from "../auth/middleware/company/verifyTokenCompany";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { CompanyController } from "../controllers/CompanyController";
import { Status } from "../env/status";

// criando um objeto de RoleController
const companyController = new CompanyController();
const verifyTokenCompany = new VerifyTokenCompany();
const verifyTokenUser = new VerifyTokenUser();

const routerCompany = Router();

routerCompany.post(
  "/api/v1/company",
  verifyTokenUser.verifyTokenADM,
  companyController.create
);
routerCompany.post(
  "/api/v1/getCompany",
  verifyTokenUser.verifyTokenAuth,
  companyController.read
);

routerCompany.get(
  "/api/v1/company/:companyID",
  verifyTokenCompany.verifyADMCompany,
  companyController.readFromID
);
routerCompany.get("/api/v1/company", verifyTokenCompany.verifyADMCompany);

routerCompany.get(
  "/api/v1/companyAll/:companyID",
  verifyTokenUser.verifyTokenAuth,
  companyController.readAllFromCompany
);
routerCompany.get("/api/v1/companyAll", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Status.ID_NOT_FOUND,
  });
});

// criando a rota de pesquisa da Role pelo id
routerCompany.get(
  "/api/v1/companyAddress/:companyID",
  verifyTokenCompany.verifyADMCompany,
  companyController.readCompanyAddress
);
routerCompany.get(
  "/api/v1/companyAddress",
  verifyTokenCompany.verifyADMCompany
);

routerCompany.get(
  "/api/v1/companyContact/:companyID",
  verifyTokenCompany.verifyADMCompany,
  companyController.readCompanyContact
);
routerCompany.get(
  "/api/v1/companyContact",
  verifyTokenCompany.verifyADMCompany
);

routerCompany.get(
  "/api/v1/showCompanies",
  verifyTokenUser.verifyTokenAuth,
  companyController.show
);

routerCompany.put(
  "/api/v1/company",
  verifyTokenCompany.verifyADMCompany,
  companyController.update
);

routerCompany.delete(
  "/api/v1/company/:companyID",
  verifyTokenCompany.verifyADMCompany,
  companyController.delete
);
routerCompany.delete("/api/v1/company", verifyTokenCompany.verifyADMCompany);

export { routerCompany };
