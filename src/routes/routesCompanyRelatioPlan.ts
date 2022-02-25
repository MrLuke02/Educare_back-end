import { Router } from "express";
import { CompanyRelationPlanController } from "../controllers/CompanyRelationPlanController";

// criando um objeto de RoleController
const companyRelationPlanController = new CompanyRelationPlanController();

const routerCompanyRelationPlan = Router();

// criando a rota de cadastro de Roles
routerCompanyRelationPlan.post(
  "/companyRelationPlan",
  companyRelationPlanController.create
);

// criando a rota de listagem de todos as Roles
routerCompanyRelationPlan.get(
  "/showCompanyRelationPlans",
  companyRelationPlanController.show
);
// criando a rota de pesquisa da Role pelo id
routerCompanyRelationPlan.get(
  "/companyRelationPlan/:id",
  companyRelationPlanController.read
);

// criando a rota de deleção de Roles
routerCompanyRelationPlan.delete(
  "/companyRelationPlan/:id",
  companyRelationPlanController.delete
);

// exportando o router
export { routerCompanyRelationPlan };
