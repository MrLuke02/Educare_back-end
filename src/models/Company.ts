import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import { User } from "./User";

import { v4 as uuid } from "uuid";

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
