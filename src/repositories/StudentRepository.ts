import { EntityRepository, Repository } from "typeorm";
import { Student } from "../models/Student";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Student)
// extendendo a classe Repository, passando também o model
class StudentsRepository extends Repository<Student> {}

// exportando a classe
export { StudentsRepository };
