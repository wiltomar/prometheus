import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

class Base {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn()
  inclusao: Date;

  @UpdateDateColumn()
  edicao: Date;

  @Column()
  status: number;
}

export default Base;
