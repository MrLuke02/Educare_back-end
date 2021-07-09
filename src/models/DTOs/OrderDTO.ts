import { Order } from "../Order";

class OrderDTO {
  public readonly id: string;

  public readonly copyNumber: number;

  public readonly status: string;

  public readonly price: number;

  public readonly userID: string;

  public readonly documentID: string;

  public readonly categoryID: string;

  // criando o cronstrutor do RoleResponseDTO a ser retornado, passando para ele a role
  constructor(order: Order) {
    // capturando todos os atributos da role, menos a data de criação e o id
    const { createdAt, ...props } = order;
    // alimentando o RoleResponseDTO com as propriedades da role
    Object.assign(this, props);
  }

  // criando o metodo statico que para possa acessa-lo atravez da classe, esse metodo retorna um RoleResponseDTO com todos os seus atributos preenchidos com os dados da role
  static convertOrderToDTO(order: Order): OrderDTO {
    return new OrderDTO(order);
  }
}

// exportando a classe
export { OrderDTO };
