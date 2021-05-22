import { EntityRepository, Repository } from "typeorm";
import { CompanyAddress } from "../models/CompanyAddress";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(CompanyAddress)
// extendendo a classe Repository, passando também o model
class CompanyAddressRepository extends Repository<CompanyAddress> {}

// exportando a classe
export { CompanyAddressRepository };
