import { EntityRepository, Repository } from "typeorm";
import { Phone } from "../models/Phone";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Phone)
// extendendo a classe Repository, passando também o model
class PhonesRepository extends Repository<Phone> {}

// exportando a classe
export { PhonesRepository };
