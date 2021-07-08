import { EntityRepository, Repository } from "typeorm";
import { Order } from "../models/Order";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(Order)
// extendendo a classe Repository, passando também o model
class OrdersRepository extends Repository<Order> {}

// exportando a classe
export { OrdersRepository };
