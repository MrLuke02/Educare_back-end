import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "./User";

@Entity("companies")
class Company {
  @PrimaryColumn()
  id: string;

  @Column()
  companyName: string;

  @Column()
  cnpj: string;

  @Column({ unique: false })
  companyCategory: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userID: string;

  // criando o relacionamento de um para um com a tabela User
  @OneToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Company };
