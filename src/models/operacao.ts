import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

@Entity('operacoes')
export class Operacao {
  @PrimaryGeneratedColumn({ name: 'operacaoid' })
  id: number;

  @Column({ name: 'operacaonome' })
  nome: string;
}

export default Operacao;