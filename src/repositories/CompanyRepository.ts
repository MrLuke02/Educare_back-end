import { EntityRepository, Repository } from "typeorm";
import { Company } from "../models/Company";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Company)
// extendendo a classe Repository, passando também o model
class CompaniesRepository extends Repository<Company> {}

// exportando a classe
export { CompaniesRepository };
