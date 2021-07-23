import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Company } from "./Company";

// criando o modelo da tabela phones, especificando suas colunas e tipo de dado que será armazenado
@Entity("company_addresses")
class CompanyAddress {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  street: string;

  @Column()
  houseNumber: string;

  @Column()
  bairro: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  cep: string;

  @Column()
  referencePoint: string;

  @Column()
  complement: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  companyID: string;

  // criando o relacionamento de um para um com a tabela User
  @OneToOne(() => Company)
  @JoinColumn({ name: "companyID" })
  company: Company;
}

// exportando a classe
export { CompanyAddress };
