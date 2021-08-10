import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("order_status")
class OrderStatus {
  @PrimaryColumn()
  id: string;

  @Column()
  key: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// exportando a classe
export { OrderStatus };
