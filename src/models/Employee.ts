import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { Company } from "./Company";
import { User } from "./User";

// criando o modelo da tabela employees, especificando suas colunas e tipo de dado que será armazenado
@Entity("employees")
class Employee {
  @PrimaryColumn()
  id: string;

  @Column()
  occupation: string;

  @Column()
  userID: string;

  // criando o relacionamento de um para um com a tabela User
  @OneToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;

  @Column()
  companyID: string;

  // criando o relacionamento de um para um com a tabela Company
  @ManyToOne(() => Company)
  @JoinColumn({ name: "companyID" })
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// exportando a classe
export { Employee };
