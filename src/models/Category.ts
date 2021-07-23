import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

// criando o modelo da tabela phones, especificando suas colunas e tipo de dado que será armazenado
@Entity("categories")
class Category {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  colorful: boolean;

  @Column()
  hasAd: boolean;

  @Column()
  deliveryTimeInDays: number;

  @Column()
  qtdMaxPage: number;

  @Column()
  qtdMinPage: number;

  @Column()
  limiteCopiesMonthly: number;

  @Column()
  limiteCopiesMonthlyUser: number;

  @CreateDateColumn()
  createdAt: Date;
}

// exportando a classe
export { Category };
