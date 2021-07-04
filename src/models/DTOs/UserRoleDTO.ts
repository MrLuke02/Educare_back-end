import { UserRole } from "../UserRole";

// criando o UserRoleResponseDTO para retorno, como os campos que se deseja retornar
class UserRoleDTO {
  id: string;

  userID: string;

  roleID: string;

  // criando o cronstrutor do UserRoleResponseDTO a ser retornado, passando para ele a UserRole
  constructor(userRole: UserRole) {
    // capturando todos os atributos da UserRole, menos a data de criação e o id
    const { createdAt, ...props } = userRole;
    // alimentando o UserRoleResponseDTO com as propriedades da UserRole
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um UserRoleResponseDTO com todos os seus atributos preenchidos com os dados da UserRole
  static convertUserRoleToDTO(userRole: UserRole): UserRoleDTO {
    return new UserRoleDTO(userRole);
  }
}

// exportando o RoleResponseDTO
export { UserRoleDTO };
