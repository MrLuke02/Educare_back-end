import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

// criando o modelo da tabela phones, especificando suas colunas e tipo de dado que será armazenado
@Entity("phones")
class Phone {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userID: string;

  // criando o relacionamento de um para um com a tabela User
  @ManyToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;
}

// exportando a classe
export { Phone };
