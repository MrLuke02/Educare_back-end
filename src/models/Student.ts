import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { InterestArea } from "./InterestArea";
import { User } from "./User";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("students")
class Student {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  expiresIn: number;

  @Column()
  interestAreaID: string;

  @ManyToOne(() => InterestArea)
  @JoinColumn({ name: "interestAreaID" })
  interestArea: InterestArea;

  @Column()
  userID: string;

  // criando o relacionamento de muitos para um com a tabela User
  @OneToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}

// exportando a classe
export { Student };
