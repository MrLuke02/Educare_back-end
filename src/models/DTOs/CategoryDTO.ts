import { Category } from "../Category";

// criando o UserResponseDTO para retorno, como os campos que se deseja retornar
class CategoryDTO {
  public readonly id: string;

  public readonly name: string;

  public readonly description: string;

  public readonly price: number;

  public readonly colorful: boolean;

  public readonly hasAd: boolean;

  public readonly deliveryTimeInDays: number;

  public readonly qtdMaxPage: number;

  public readonly qtdMinPage: number;

  public readonly limiteCopiesMonthlyUser: number;

  public readonly limiteCopiesMonthly: number;

  // criando o cronstrutor do UserResponseDTO a ser retornado, passando para ele o usuário
  constructor(category: Category) {
    // capturando todos os atributos da usuário, menos a senha, a data de criação e o id
    const { createdAt, ...props } = category;
    // alimentando o UserResponseDTO com as propriedades do usuário
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um responseUserDTO com todos os seus atributos preenchidos com os dados do usuário
  static covertCategoryToDTO(category: Category): CategoryDTO {
    return new CategoryDTO(category);
  }
}

// exportando o UserResponseDTO
export { CategoryDTO };
