import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

@Entity('naturezadaoperacao')
export class NaturezaOperacao {
  @PrimaryGeneratedColumn({ name: 'naturezadaoperacaoid' })
  id: number;

  @Column({ name: 'nome' })
  nome: string;
}

export default NaturezaOperacao;