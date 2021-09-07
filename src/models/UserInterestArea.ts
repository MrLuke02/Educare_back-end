import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("user_interest_area")
class UserInterestArea {
  @PrimaryColumn()
  id: string;

  @Column()
  userInterestArea: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// exportando a classe
export { UserInterestArea };
