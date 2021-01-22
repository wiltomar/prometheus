import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

class Base {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn()
  inclusao: Date;

  @UpdateDateColumn()
  edicao: Date;
}

export default Base;
