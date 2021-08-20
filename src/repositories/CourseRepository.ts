import { EntityRepository, Repository } from "typeorm";
import { Course } from "../models/Course";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Course)
// extendendo a classe Repository, passando também o model
class CoursesRepository extends Repository<Course> {}

// exportando a classe
export { CoursesRepository };
