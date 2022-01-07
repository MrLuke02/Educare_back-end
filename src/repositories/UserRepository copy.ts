import { EntityRepository, Repository } from "typeorm";
import { Employee } from "../models/Employee";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Employee)
// extendendo a classe Repository, passando também o model
class EmployeesRepository extends Repository<Employee> {}

// exportando a classe
export { EmployeesRepository };
