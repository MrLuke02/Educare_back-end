import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity("companies")
class Company {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  companyName: string;

  @Column()
  cnpj: string;

  @Column({ unique: false })
  companyCategory: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userID: string;

  // criando o relacionamento de um para um com a tabela User
  @OneToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;
}

export { Company };
