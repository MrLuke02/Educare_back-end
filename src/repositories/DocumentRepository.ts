import { EntityRepository, Repository } from "typeorm";
import { Document } from "../models/Document";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Document)
// extendendo a classe Repository, passando também o model
class DocumentsRepository extends Repository<Document> {}

// exportando a classe
export { DocumentsRepository };
