import { Column, CreateDateColumn, Entity, IsNull, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity("users")
class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;


  @Column()
  email: string;


  @Column()
  password: string;


  @Column({ nullable: true })
  public address?: string;

  @Column()
  phone: string;

  @CreateDateColumn()
  createdAt: Date;


  @Column()
  isAdm: boolean;


  constructor() {
    if (!this.id) {
      this.id = uuid();
    }

    if (this.isAdm == null) {
      this.isAdm = false;
    }
  }


}

export { User };