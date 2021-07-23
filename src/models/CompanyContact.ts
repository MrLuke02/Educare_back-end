import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Company } from "./Company";

@Entity("company_contacts")
class CompanyContact {
  @PrimaryGeneratedColumn()
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
}

export { CompanyContact };
