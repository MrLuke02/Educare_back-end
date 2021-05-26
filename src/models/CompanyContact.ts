import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { Company } from "./Company";

@Entity("companyContacts")
class CompanyContact {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  companyID: string;

  // criando o relacionamento de um para um com a tabela User
  @OneToOne(() => Company)
  @JoinColumn({ name: "companyID" })
  company: Company;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { CompanyContact };
