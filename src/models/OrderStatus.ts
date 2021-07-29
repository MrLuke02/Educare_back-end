import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("order_status")
class OrderStatus {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  key: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}

// exportando a classe
export { OrderStatus };
