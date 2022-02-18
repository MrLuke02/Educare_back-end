import { EntityRepository, Repository } from "typeorm";
import { EmployeeOrder } from "../models/EmployeeOrder";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(EmployeeOrder)
// extendendo a classe Repository, passando também o model
class EmployeeOrderRepository extends Repository<EmployeeOrder> {}

// exportando a classe
export { EmployeeOrderRepository };
