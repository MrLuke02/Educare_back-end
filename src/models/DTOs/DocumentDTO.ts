import { Document } from "../Document";

class DocumentDTO {
  public readonly id: string;

  public readonly type: string;

  public readonly size: number;

  public readonly name: string;

  public readonly pageNumber: number;

  public readonly file: Buffer;

  // criando o cronstrutor do RoleResponseDTO a ser retornado, passando para ele a role
  constructor(document: Document) {
    // capturando todos os atributos da role, menos a data de criação e o id
    const { createdAt, ...props } = document;
    // alimentando o RoleResponseDTO com as propriedades da role
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um RoleResponseDTO com todos os seus atributos preenchidos com os dados da role
  static convertDocumentToDTO(document: Document): DocumentDTO {
    return new DocumentDTO(document);
  }
}

// exportando a classe
export { DocumentDTO };
