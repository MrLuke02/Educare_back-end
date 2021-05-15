import { EntityRepository, Repository } from "typeorm";
import { Address } from "../models/Address";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Address)
// extendendo a classe Repository, passando também o model
class AddressRepository extends Repository<Address> {}

// exportando a classe
export { AddressRepository };
