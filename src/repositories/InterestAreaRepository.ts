import { EntityRepository, Repository } from "typeorm";
import { InterestArea } from "../models/InterestArea";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(InterestArea)
// extendendo a classe Repository, passando também o model
class InterestAreaRepository extends Repository<InterestArea> {}

// exportando a classe
export { InterestAreaRepository };
