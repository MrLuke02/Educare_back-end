import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  ManyToOne,
} from "typeorm";
import { Category } from "./Category";
import { Document } from "./Document";
import { OrderStatus } from "./OrderStatus";
import { User } from "./User";
import { v4 as uuid } from "uuid";

@Entity("orders")
class Order {
  @PrimaryColumn()
  id: string;

  @Column()
  copyNumber: number;

  @Column()
  statusID: string;

  @Column()
  price: number;

  @Column()
  userID: string;

  // criando o relacionamento de um para um com a tabela User
  @OneToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;

  @Column()
  documentID: string;

  // criando o relacionamento de um para um com a tabela User
  @OneToOne(() => Document)
  @JoinColumn({ name: "documentID" })
  document: Document;

  // criando o relacionamento de um para um com a tabela User
  @ManyToOne(() => OrderStatus)
  @JoinColumn({ name: "statusID" })
  status: OrderStatus;

  @Column()
  categoryID: string;

  // criando o relacionamento de um para um com a tabela User
  @OneToOne(() => Category)
  @JoinColumn({ name: "categoryID" })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// exportando a classe
export { Order };
