import { Phone } from "../Phone";

// criando o RoleResponseDTO para retorno, como os campos que se deseja retornar
class PhoneDTO {
  id: string;

  phoneNumber: string;

  // criando o construtor do RoleResponseDTO a ser retornado, passando para ele a role
  constructor(phone: Phone) {
    // capturando todos os atributos da role, menos a data de criação e o id
    const { createdAt, userID, ...props } = phone;
    // alimentando o RoleResponseDTO com as propriedades da role
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um RoleResponseDTO com todos os seus atributos preenchidos com os dados da role
  static convertPhoneToDTO(phone: Phone): PhoneDTO {
    return new PhoneDTO(phone);
  }
}

// exportando o RoleResponseDTO
export { PhoneDTO };
