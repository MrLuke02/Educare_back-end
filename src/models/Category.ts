import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

// criando o modelo da tabela phones, especificando suas colunas e tipo de dado que será armazenado
@Entity("categories")
class Category {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  value: number;

  // @Column()
  // colorful: boolean;

  // @Column()
  // haveAds: boolean;

  // @Column()
  // deadline: boolean;

  // @Column()
  // pageCountMax: number;

  // @Column()
  // pageCountMin: number;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// exportando a classe
export { Category };
