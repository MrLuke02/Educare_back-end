import { EntityRepository, Repository } from "typeorm";
import { Category } from "../models/Category";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Category)
// extendendo a classe Repository, passando também o model
class CategoriesRepository extends Repository<Category> {}

// exportando a classe
export { CategoriesRepository };
