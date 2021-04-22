import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

// definindo a estrutura da entidade, definindo cada coluna e seus especificidades
// definindo o nome da entidade
@Entity("users")
class User {
  // definindo como PK, do tipo string
  @PrimaryColumn()
  id: string;

  // definindo como uma coluna, do tipo string
  @Column()
  name: string;

  // definindo como uma coluna, do tipo string
  @Column()
  email: string;

  // definindo como uma coluna, do tipo string
  @Column()
  password: string;

  // definindo como uma coluna, do tipo string, que pode ser nula
  @Column()
  address: string;

  // definindo como uma coluna, do tipo string
  @Column()
  phone: string;

  // definindo como uma coluna de data, do tipo date
  @CreateDateColumn()
  createdAt: Date;

  // definindo como uma coluna, do tipo boolean
  @Column()
  isAdm: boolean;

  // definindo o construtor da classe
  constructor() {
    // se a entidade não possuir um id crie um utilizando uuid()
    if (!this.id) {
      this.id = uuid();
    }

    // se a coluna isAdm do entidade for nula, atribua a ela o valor de false
    if (this.isAdm == null) {
      this.isAdm = false;
    }
  }
}

export { User };
