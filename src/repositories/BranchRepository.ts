import { EntityRepository, Repository } from "typeorm";
import { Branch } from "../models/Branch";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Branch)
// extendendo a classe Repository, passando também o model
class BranchesRepository extends Repository<Branch> {}

// exportando a classe
export { BranchesRepository };
