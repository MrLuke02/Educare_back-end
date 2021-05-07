import { EntityRepository, Repository } from "typeorm";
import { UserRole } from "../models/UserRole";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(UserRole)
// extendendo a classe Repository, passando também o model
class UserRoleRepository extends Repository<UserRole> {}

// exportando a classe
export { UserRoleRepository };
