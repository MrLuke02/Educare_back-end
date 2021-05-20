import { Company } from "../../Company";

// criando o RoleResponseDTO para retorno, como os campos que se deseja retornar
class CompanyResponseDTO {
  private compayName: string;

  private cnpj: string;

  private inscricaoEstadual: string;

  // criando o cronstrutor do RoleResponseDTO a ser retornado, passando para ele a role
  constructor(company: Company) {
    // capturando todos os atributos da role, menos a data de criação e o id
    const { createdAt, id, userID, ...props } = company;
    // alimentando o RoleResponseDTO com as propriedades da role
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um RoleResponseDTO com todos os seus atributos preenchidos com os dados da role
  static responseCompanyDTO(company: Company): CompanyResponseDTO {
    return new CompanyResponseDTO(company);
  }
}

// exportando o RoleResponseDTO
export { CompanyResponseDTO };
