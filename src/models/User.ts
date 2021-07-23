import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

// criando o modelo da tabela users, especificando suas colunas e tipo de dado que será armazenado
@Entity("users")
class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}

// exportando a classe
export { User };
