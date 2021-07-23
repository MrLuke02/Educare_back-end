import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("documents")
class Document {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  size: number;

  @Column()
  name: string;

  @Column()
  pageNumber: number;

  @Column({ type: "bytea" })
  file: Buffer;

  @CreateDateColumn()
  createdAt: Date;
}

// exportando a classe
export { Document };
