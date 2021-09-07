import { EntityRepository, Repository } from "typeorm";
import { UserInterestArea } from "../models/UserInterestArea";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(UserInterestArea)
// extendendo a classe Repository, passando também o model
class UserInterestAreaRepository extends Repository<UserInterestArea> {}

// exportando a classe
export { UserInterestAreaRepository };
