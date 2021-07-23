import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

// criando o modelo da tabela roles, especificando suas colunas e tipo de dado que será armazenado
@Entity("roles")
class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;
}

// exportando a classe
export { Role };
