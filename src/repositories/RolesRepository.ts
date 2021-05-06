import { EntityRepository, Repository } from "typeorm";
import { Role } from "../models/Role";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Role)
// extendendo a classe Repository, passando também o model
class RolesRepository extends Repository<Role> {}

// exportando a classe
export { RolesRepository };
