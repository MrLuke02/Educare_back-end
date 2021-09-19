import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import { Category } from "./Category";
import { Document } from "./Document";
import { User } from "./User";
import { v4 as uuid } from "uuid";

@Entity("orders")
class Order {
  @PrimaryColumn()
  id: string;

  @Column()
  copyNumber: number;

  @Column()
  price: number;

  @Column()
  status: string;

  @Column()
  isDelivery: boolean;

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
