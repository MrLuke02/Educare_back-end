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

// criando o modelo da tabela phones, especificando suas colunas e tipo de dado que será armazenado
@Entity("phones")
class Phone {
  @PrimaryColumn()
  id: string;

  @Column()
  phoneNumber: string;

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

// exportando a classe
export { Phone };
