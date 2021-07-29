import { EntityRepository, Repository } from "typeorm";
import { OrderStatus } from "../models/OrderStatus";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(OrderStatus)
// extendendo a classe Repository, passando também o model
class OrderStatusRepository extends Repository<OrderStatus> {}

// exportando a classe
export { OrderStatusRepository };
