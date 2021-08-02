import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("token_refresh")
class TokenRefresh {
  @PrimaryGeneratedColumn()
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
}

// exportando a classe
export { TokenRefresh };
