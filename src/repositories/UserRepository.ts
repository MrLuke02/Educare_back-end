import { EntityRepository, Repository } from "typeorm";
import { User } from "../models/User";

// criando um repositório customizado
// definindo a anotação de EntityRepository passando qual será o model
@EntityRepository(User)

// herdando a classe Repository passando o tipo
class UsersRepository extends Repository<User> {}

export { UsersRepository };
