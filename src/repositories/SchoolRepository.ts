import { EntityRepository, Repository } from "typeorm";
import { School } from "../models/School";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(School)
// extendendo a classe Repository, passando também o model
class SchoolsRepository extends Repository<School> {}

// exportando a classe
export { SchoolsRepository };
