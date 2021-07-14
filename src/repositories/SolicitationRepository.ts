import { EntityRepository, Repository } from "typeorm";
import { Solicitation } from "../models/Solicitation";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Solicitation)
// extendendo a classe Repository, passando também o model
class SolicitationsRepository extends Repository<Solicitation> {}

// exportando a classe
export { SolicitationsRepository };
