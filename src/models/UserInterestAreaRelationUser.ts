import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "./User";
import { UserInterestArea } from "./UserInterestArea";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("user_interest_area_relation_user")
class UserInterestAreaRelationUser {
  @PrimaryColumn()
  id: string;

  @Column()
  userID: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;

  @Column()
  userInterestAreaID: string;

  // criando o relacionamento de muitos para um com a tabela User
  @ManyToOne(() => UserInterestArea)
  @JoinColumn({ name: "userInterestAreaID" })
  userInterestArea: UserInterestArea;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// exportando a classe
export { UserInterestAreaRelationUser };
