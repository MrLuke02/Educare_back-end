import { EntityRepository, Repository } from "typeorm";
import { CompanyRelationPlan } from "../models/CompanyRelationPlan";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(CompanyRelationPlan)
// extendendo a classe Repository, passando também o model
class CompanyRelationPlansRepository extends Repository<CompanyRelationPlan> {}

// exportando a classe
export { CompanyRelationPlansRepository };
