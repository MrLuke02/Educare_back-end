import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { Category } from "./Category";
import { Document } from "./Document";
import { User } from "./User";

@Entity("orders")
class Order {
  @PrimaryColumn()
  id: string;

  @Column()
  copyNumber: number;

  @Column()
  status: string;

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
