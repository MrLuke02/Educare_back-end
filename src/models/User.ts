import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

// criando o modelo da tabela users, especificando suas colunas e tipo de dado que será armazenado
@Entity("users")
class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  isAdm: boolean;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }

    if (this.isAdm == null) {
      this.isAdm = false;
    }
  }
}

// exportando a classe
export { User };
