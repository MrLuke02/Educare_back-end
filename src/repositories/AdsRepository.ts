import { EntityRepository, Repository } from "typeorm";
import { Ad } from "../models/Ad";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Ad)
// extendendo a classe Repository, passando também o model
class AdsRepository extends Repository<Ad> {}

// exportando a classe
export { AdsRepository };
