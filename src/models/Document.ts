import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("documents")
class Document {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  size: number;

  @Column()
  name: string;

  @Column()
  pageNumber: number;

  @Column()
  file: Buffer;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// exportando a classe
export { Document };
