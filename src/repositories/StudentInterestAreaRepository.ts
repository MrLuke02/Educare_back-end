import { EntityRepository, Repository } from "typeorm";
import { StudentInterestArea } from "../models/StudentInterestArea";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(StudentInterestArea)
// extendendo a classe Repository, passando também o model
class StudentInterestAreaRepository extends Repository<StudentInterestArea> {}

// exportando a classe
export { StudentInterestAreaRepository };
