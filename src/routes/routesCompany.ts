import { Request, Response, Router } from "express";
import { CompanyController } from "../controllers/CompanyController";
import { VerifyTokenCompany } from "../auth/middleware/company/verifyTokenCompany";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { Erros } from "../env/status";

// criando um objeto de RoleController
const companyController = new CompanyController();
const verifyTokenCompany = new VerifyTokenCompany();
const verifyTokenUser = new VerifyTokenUser();

const routerCompany = Router();

routerCompany.post(
  "/api/v1/company",
  verifyTokenCompany.verifyCreate,
  companyController.create
);
routerCompany.post("/api/v1/getCompany", companyController.read);

routerCompany.get(
  "/api/v1/company/:id",
  verifyTokenUser.verifyTokenADM,
  companyController.readFromID
);
routerCompany.get("/api/v1/company/", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Erros.ID_NOT_FOUND,
  });
});
routerCompany.get(
  "/api/v1/showCompanies",
  verifyTokenUser.verifyTokenAuth,
  companyController.show
);

routerCompany.put(
  "/api/v1/company",
  verifyTokenCompany.verifyUpdate,
  companyController.update
);

routerCompany.delete(
  "/api/v1/company/:id",
  verifyTokenCompany.verifyDelete,
  companyController.delete
);
routerCompany.delete("/api/v1/company/", (req: Request, res: Response) => {
  return res.status(422).json({
    Message: Erros.ID_NOT_FOUND,
  });
});

export { routerCompany };
