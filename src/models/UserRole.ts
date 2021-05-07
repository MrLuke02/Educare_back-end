import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { Role } from "./Role";
import { User } from "./User";

// criando o modelo da tabela user_roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("user_roles")
class UserRole {
  @PrimaryColumn()
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

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// exportando a classe
export { UserRole };
