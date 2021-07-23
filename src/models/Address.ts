import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";

// criando o modelo da tabela phones, especificando suas colunas e tipo de dado que será armazenado
@Entity("addresses")
class Address {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  street: string;

  @Column()
  houseNumber: string;

  @Column()
  bairro: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  cep: string;

  @Column()
  referencePoint: string;

  @Column()
  complement: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userID: string;

  // criando o relacionamento de um para um com a tabela User
  @OneToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;
}

// exportando a classe
export { Address };
