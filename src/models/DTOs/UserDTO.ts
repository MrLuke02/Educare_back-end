import { User } from "../User";

// criando o UserResponseDTO para retorno, como os campos que se deseja retornar
class UserDTO {
  private id: string;

  private name: string;

  private email: string;

  private address: string;

  // criando o cronstrutor do UserResponseDTO a ser retornado, passando para ele o usuário
  constructor(user: User) {
    // capturando todos os atributos da usuário, menos a senha, a data de criação e o id
    const { password, createdAt, ...props } = user;
    // alimentando o UserResponseDTO com as propriedades do usuário
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um responseUserDTO com todos os seus atributos preenchidos com os dados do usuário
  static convertUserToDTO(user: User): UserDTO {
    return new UserDTO(user);
  }
}

// exportando o UserResponseDTO
export { UserDTO };
