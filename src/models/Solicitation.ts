import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { v4 as uuid } from "uuid";
import { StudentInterestArea } from "./StudentInterestArea";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("solicitations")
class Solicitation {
  @PrimaryColumn()
  id: string;

  @Column({ type: "bytea" })
  file: Buffer;

  @Column()
  status: string;

  @Column()
  course: string;

  @Column()
  institution: string;

  @Column()
  studentInterestAreaID: string;

  @ManyToOne(() => StudentInterestArea)
  @JoinColumn({ name: "studentInterestAreaID" })
  studentInterestArea: StudentInterestArea;

  @Column()
  userID: string;

  // criando o relacionamento de muitos para um com a tabela User
  @OneToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;

  @Column()
  admID: string;

  // criando o relacionamento de muitos para um com a tabela User
  @OneToOne(() => User)
  @JoinColumn({ name: "admID" })
  adm: User;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// exportando a classe
export { Solicitation };
