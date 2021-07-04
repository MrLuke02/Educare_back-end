import { CompanyContact } from "../CompanyContact";

// criando o RoleResponseDTO para retorno, como os campos que se deseja retornar
class CompanyContactDTO {
  id: string;

  email: string;

  phone: string;

  // criando o cronstrutor do RoleResponseDTO a ser retornado, passando para ele a role
  constructor(companyContact: CompanyContact) {
    // capturando todos os atributos da role, menos a data de criação e o id
    const { createdAt, companyID, ...props } = companyContact;
    // alimentando o RoleResponseDTO com as propriedades da role
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um RoleResponseDTO com todos os seus atributos preenchidos com os dados da role
  static convertCompanyContactToDTO(
    companyContact: CompanyContact
  ): CompanyContactDTO {
    return new CompanyContactDTO(companyContact);
  }
}

// exportando o RoleResponseDTO
export { CompanyContactDTO };
