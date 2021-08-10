import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "./User";
import { v4 as uuid } from "uuid";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("token_refresh")
class TokenRefresh {
  @PrimaryColumn()
  id: string;

  @Column()
  expiresIn: number;

  @Column()
  userID: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// exportando a classe
export { TokenRefresh };
