import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import { Company } from "./Company";
import { v4 as uuid } from "uuid";

@Entity("company_contacts")
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
