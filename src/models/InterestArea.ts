import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("interest_area")
class InterestArea {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  interestArea: string;

  @CreateDateColumn()
  createdAt: Date;
}

// exportando a classe
export { InterestArea };
