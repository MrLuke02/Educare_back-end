import { Plan } from "../../Plan";

// criando o UserResponseDTO para retorno, como os campos que se deseja retornar
class PlanResponseDTO {
  private name: string;

  private description: string;

  private value: number;

  // criando o cronstrutor do UserResponseDTO a ser retornado, passando para ele o usuário
  constructor(plan: Plan) {
    // capturando todos os atributos da usuário, menos a senha, a data de criação e o id
    const { createdAt, id, ...props } = plan;
    // alimentando o UserResponseDTO com as propriedades do usuário
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um responseUserDTO com todos os seus atributos preenchidos com os dados do usuário
  static responsePlanDTO(plan: Plan): PlanResponseDTO {
    return new PlanResponseDTO(plan);
  }
}

// exportando o UserResponseDTO
export { PlanResponseDTO };
