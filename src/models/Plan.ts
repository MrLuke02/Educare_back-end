import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Double,
} from "typeorm";
import { v4 as uuid } from "uuid";

// criando o modelo da tabela phones, especificando suas colunas e tipo de dado que será armazenado
@Entity("plans")
class Plan {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// exportando a classe
export { Plan };
