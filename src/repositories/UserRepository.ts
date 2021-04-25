import { EntityRepository, Repository } from "typeorm";
import { User } from "../models/User";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(User)
// extendendo a classe Repository, passando também o model
class UsersRepository extends Repository<User> {}

// exportando a classe
export { UsersRepository };
