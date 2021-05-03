import { User } from "../../User";

// criando o UserResponseDTO para retorno, como os campos que se deseja retornar
class UserResponseDTO {
  private id: string;

  private name: string;

  private email: string;

  private address: string;

  private phone: string;

  private isAdm: boolean;

  // criando o cronstrutor do UserResponseDTO a ser retornado, passando para ele o usuário
  constructor(user: User) {
    // capturando todos os atributos de usuário menos a senha e a data de criação
    const { password, createdAt, ...props } = user;
    // alimentando o UserResponseDTO com as propriedades do usuário
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um responseUserDTO com todos os seus atributos preenchidos com os dados do usuário
  static responseUserDTO(user: User): UserResponseDTO {
    return new UserResponseDTO(user);
  }
}

// exportando o UserResponseDTO
export { UserResponseDTO };
