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
import { User } from "./User";
import { v4 as uuid } from "uuid";
import { Company } from "./Company";

@Entity("employee_orders")
class EmployeeOrder {
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
  @ManyToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;

  @Column()
  companyID: string;

  // criando o relacionamento de um para um com a tabela Company
  @ManyToOne(() => Company)
  @JoinColumn({ name: "companyID" })
  company: Company;

  @Column()
  documentID: string;

  // criando o relacionamento de um para um com a tabela User
  @OneToOne(() => Document)
  @JoinColumn({ name: "documentID" })
  document: Document;

  @Column()
  categoryID: string;

  // criando o relacionamento de um para um com a tabela User
  @ManyToOne(() => Category)
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
export { EmployeeOrder };
