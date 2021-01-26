import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Base from './base';
import Estabelecimento from './estabelecimento';

@Entity('Mosaico.ContaCorrente')
class ContaCorrente extends Base {
  @Column()
  nome: string;

  @Column()
  sigla: string;

  @Column()
  ativo: boolean;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'estabelecimentoid' })
  estabelecimento: Estabelecimento;

  @Column()
  tipo: number;
}

export default ContaCorrente;