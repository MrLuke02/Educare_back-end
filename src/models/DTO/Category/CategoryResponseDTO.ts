import { Category } from "../../Category";

// criando o UserResponseDTO para retorno, como os campos que se deseja retornar
class CategoryResponseDTO {
  private id: string;

  private name: string;

  private description: string;

  private value: number;

  private colorful: boolean;

  private hasAd: boolean;

  private deliveryTimeInDays: number;

  private qtdMaxPage: number;

  private qtdMinPage: number;

  private limiteCopiesMonthlyUser: number;

  private limiteCopiesMonthly: number;

  // criando o cronstrutor do UserResponseDTO a ser retornado, passando para ele o usuário
  constructor(category: Category) {
    // capturando todos os atributos da usuário, menos a senha, a data de criação e o id
    const { createdAt, ...props } = category;
    // alimentando o UserResponseDTO com as propriedades do usuário
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um responseUserDTO com todos os seus atributos preenchidos com os dados do usuário
  static responseCategoryDTO(category: Category): CategoryResponseDTO {
    return new CategoryResponseDTO(category);
  }
}

// exportando o UserResponseDTO
export { CategoryResponseDTO };
