import { EntityRepository, Repository } from "typeorm";
import { Plan } from "../models/Plan";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Plan)
// extendendo a classe Repository, passando também o model
class PlansRepository extends Repository<Plan> {}

// exportando a classe
export { PlansRepository };
