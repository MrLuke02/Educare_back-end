import { EntityRepository, Repository } from "typeorm";
import { CompanyContact } from "../models/CompanyContact";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(CompanyContact)
// extendendo a classe Repository, passando também o model
class CompanyContactRepository extends Repository<CompanyContact> {}

// exportando a classe
export { CompanyContactRepository };
