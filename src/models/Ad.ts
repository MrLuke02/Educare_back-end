import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

import { v4 as uuid } from "uuid";
import { Company } from "./Company";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("ads")
class Ad {
  @PrimaryColumn()
  id: string;

  @Column({ type: "bytea" })
  file: Buffer;

  @Column()
  companyID: string;

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
export { Ad };
