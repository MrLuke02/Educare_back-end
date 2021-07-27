import { Request, Response, Router } from "express";
import { VerifyTokenCompany } from "../auth/middleware/company/verifyTokenCompany";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { CompanyController } from "../controllers/CompanyController";
import { Message } from "../env/message";
import { AppError } from "../errors/AppErrors";

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
routerCompany.get("/companyByCpnj", (req: Request, res: Response) => {
  throw new AppError(Message.CNPJ_NOT_FOUND, 422);
});

routerCompany.get(
  "/companiesByCategory/:companyCategory",
  verifyTokenUser.verifyTokenAuth,
  companyController.readFromCategory
);
routerCompany.get("/companiesByCategory", (req: Request, res: Response) => {
  throw new AppError(Message.CATEGORY_NOT_FOUND, 422);
});

routerCompany.get(
  "/company/:companyID",
  verifyTokenCompany.verifyADMCompany,
  companyController.readFromID
);
routerCompany.get("/company", verifyTokenCompany.verifyADMCompany);

routerCompany.get(
  "/companyAll/:companyID",
  verifyTokenUser.verifyTokenAuth,
  companyController.readAllFromCompany
);
routerCompany.get("/companyAll", (req: Request, res: Response) => {
  throw new AppError(Message.ID_NOT_FOUND, 422);
});

// criando a rota de pesquisa da Role pelo id
routerCompany.get(
  "/companyAddress/:companyID",
  verifyTokenCompany.verifyADMCompany,
  companyController.readCompanyAddress
);
routerCompany.get("/companyAddress", verifyTokenCompany.verifyADMCompany);

routerCompany.get(
  "/companyContact/:companyID",
  verifyTokenCompany.verifyADMCompany,
  companyController.readCompanyContact
);
routerCompany.get("/companyContact", verifyTokenCompany.verifyADMCompany);

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
routerCompany.delete("/company", verifyTokenCompany.verifyADMCompany);

export { routerCompany };
