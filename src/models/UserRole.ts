import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role";
import { User } from "./User";

// criando o modelo da tabela user_roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("user_roles")
class UserRole {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userID: string;

  // criando o relacionamento de muitos para um com a tabela User
  @ManyToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;

  @Column()
  roleID: string;

  // criando o relacionamento de muitos para um com a tabela Role
  @ManyToOne(() => Role)
  @JoinColumn({ name: "roleID" })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}

// exportando a classe
export { UserRole };
