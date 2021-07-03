import { Address } from "../Address";

// criando o RoleResponseDTO para retorno, como os campos que se deseja retornar
class AddressDTO {
  private id: string;

  private street: string;

  private houseNumber: string;

  private bairro: string;

  private state: string;

  private city: string;

  private cep: string;

  private referencePoint: string;

  private complement: string;

  // criando o cronstrutor do RoleResponseDTO a ser retornado, passando para ele a role
  constructor(address: Address) {
    // capturando todos os atributos da role, menos a data de criação e o id
    const { createdAt, userID, ...props } = address;
    // alimentando o RoleResponseDTO com as propriedades da role
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um RoleResponseDTO com todos os seus atributos preenchidos com os dados da role
  static convertAddressToDTO(address: Address): AddressDTO {
    return new AddressDTO(address);
  }
}

// exportando o RoleResponseDTO
export { AddressDTO };
