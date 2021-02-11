import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('integracoes.integradora')
class Integradora {

  @PrimaryGeneratedColumn('increment', { name: 'integradoraid'})
  id: number;

  @CreateDateColumn({ name: 'inclusao'})
  inclusao: Date;

  @CreateDateColumn({ name: 'edicao'})
  edicao: Date;

  @Column({ name: 'status' })
  status: number;

  @Column({ name: 'integradoranome' })
  nome: string;
}

export default Integradora;
