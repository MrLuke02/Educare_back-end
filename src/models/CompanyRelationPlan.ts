import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Plan } from "./Plans";
import { Company } from "./Company";
import { v4 as uuid } from "uuid";

// criando o modelo da tabela user_roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("company_relation_plans")
class CompanyRelationPlan {
  @PrimaryColumn()
  id: string;

  @Column()
  companyID: string;

  // criando o relacionamento de muitos para um com a tabela User
  @ManyToOne(() => Company)
  @JoinColumn({ name: "companyID" })
  company: Company;

  @Column()
  planID: string;

  // criando o relacionamento de muitos para um com a tabela Role
  @ManyToOne(() => Plan)
  @JoinColumn({ name: "planID" })
  plan: Plan;

  @Column()
  expiresIn: number;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// exportando a classe
export { CompanyRelationPlan };
