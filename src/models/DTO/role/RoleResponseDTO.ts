import { Role } from "../../Role";

// criando o RoleResponseDTO para retorno, como os campos que se deseja retornar
class RoleResponseDTO {
  private type: string;

  // criando o cronstrutor do RoleResponseDTO a ser retornado, passando para ele a role
  constructor(role: Role) {
    // capturando todos os atributos da role, menos a data de criação e o id
    const { createdAt, id, ...props } = role;
    // alimentando o RoleResponseDTO com as propriedades da role
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um RoleResponseDTO com todos os seus atributos preenchidos com os dados da role
  static responseRoleDTO(role: Role): RoleResponseDTO {
    return new RoleResponseDTO(role);
  }
}

// exportando o RoleResponseDTO
export { RoleResponseDTO };
