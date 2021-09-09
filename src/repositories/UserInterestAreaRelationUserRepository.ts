import { EntityRepository, Repository } from "typeorm";
import { UserInterestAreaRelationUser } from "../models/UserInterestAreaRelationUser";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(UserInterestAreaRelationUser)
// extendendo a classe Repository, passando também o model
class UserInterestAreaRelationUserRepository extends Repository<UserInterestAreaRelationUser> {}

// exportando a classe
export { UserInterestAreaRelationUserRepository };
