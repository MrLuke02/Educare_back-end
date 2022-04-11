import { Router } from "express";
import { VerifyTokenCompany } from "../auth/middleware/company/verifyTokenCompany";
import { VerifyTokenUser } from "../auth/middleware/user/verifyTokenUser";
import { CompanyRelationPlanController } from "../controllers/CompanyRelationPlanController";

// criando um objeto de RoleController
const companyRelationPlanController = new CompanyRelationPlanController();
const verifyTokenUser = new VerifyTokenUser();
const verifyTokenCompany = new VerifyTokenCompany();

const routerCompanyRelationPlan = Router();

// criando a rota de cadastro de Roles
routerCompanyRelationPlan.post(
  "/companyRelationPlan",
  verifyTokenCompany.verifyADMCompany,
  companyRelationPlanController.create
);

// criando a rota de listagem de todos as Roles
routerCompanyRelationPlan.get(
  "/showCompanyRelationPlans",
  verifyTokenUser.verifyTokenADM,
  companyRelationPlanController.show
);

// criando a rota de pesquisa da Role pelo id
routerCompanyRelationPlan.get(
  "/companyRelationPlan/:id",
  verifyTokenCompany.verifyADMCompanyByCompanyRelationPlanID,
  companyRelationPlanController.read
);

// criando a rota de pesquisa da Role pelo id
routerCompanyRelationPlan.get(
  "/companyRelationPlanByCompany/:companyID",
  verifyTokenUser.verifyTokenAuth,
  companyRelationPlanController.readFromCompanyID
);

// criando a rota de deleção de Roles
routerCompanyRelationPlan.delete(
  "/companyRelationPlan/:id",
  verifyTokenUser.verifyTokenADM,
  companyRelationPlanController.delete
);

// exportando o router
export { routerCompanyRelationPlan };
