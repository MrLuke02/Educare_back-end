import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";

import { User } from "./User";
import { v4 as uuid } from "uuid";
import { Course } from "./Course";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("students")
class Student {
  @PrimaryColumn()
  id: string;

  @Column()
  expiresIn: number;

  @Column()
  courseID: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: "courseID" })
  course: Course;

  @Column()
  userID: string;

  // criando o relacionamento de muitos para um com a tabela User
  @OneToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// exportando a classe
export { Student };
