import { CompanyAddress } from "../CompanyAddress";

// criando o RoleResponseDTO para retorno, como os campos que se deseja retornar
class CompanyAddressDTO {
  public readonly id: string;

  public readonly street: string;

  public readonly houseNumber: string;

  public readonly bairro: string;

  public readonly state: string;

  public readonly city: string;

  public readonly cep: string;

  public readonly complement: string;

  // criando o cronstrutor do RoleResponseDTO a ser retornado, passando para ele a role
  constructor(companyAddress: CompanyAddress) {
    // capturando todos os atributos da role, menos a data de criação e o id
    const { createdAt, companyID, ...props } = companyAddress;
    // alimentando o RoleResponseDTO com as propriedades da role
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um RoleResponseDTO com todos os seus atributos preenchidos com os dados da role
  static convertCompanyAddressToDTO(
    companyAddress: CompanyAddress
  ): CompanyAddressDTO {
    return new CompanyAddressDTO(companyAddress);
  }
}

// exportando o RoleResponseDTO
export { CompanyAddressDTO };
