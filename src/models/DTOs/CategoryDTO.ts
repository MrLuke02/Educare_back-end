import { Category } from "../Category";

// criando o UserResponseDTO para retorno, como os campos que se deseja retornar
class CategoryDTO {
  id: string;

  name: string;

  description: string;

  value: number;

  colorful: boolean;

  hasAd: boolean;

  deliveryTimeInDays: number;

  qtdMaxPage: number;

  qtdMinPage: number;

  limiteCopiesMonthlyUser: number;

  limiteCopiesMonthly: number;

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
