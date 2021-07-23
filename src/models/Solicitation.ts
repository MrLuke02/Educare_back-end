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
@Entity("solicitations")
class Solicitation {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "bytea" })
  file: Buffer;

  @Column()
  status: string;

  @Column()
  userID: string;

  // criando o relacionamento de muitos para um com a tabela User
  @OneToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;

  @Column()
  admID: string;

  // criando o relacionamento de muitos para um com a tabela User
  @OneToOne(() => User)
  @JoinColumn({ name: "admID" })
  adm: User;

  @CreateDateColumn()
  createdAt: Date;
}

// exportando a classe
export { Solicitation };
