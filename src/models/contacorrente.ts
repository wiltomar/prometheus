import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Basex from './basex';
import Estabelecimento from './estabelecimento';

@Entity('contascorrentes')
class ContaCorrente extends Basex {
  @Column({ name: 'descrição' })
  nome: string;

  @Column({ name: 'sigla' })
  sigla: string;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'unidadeid' })
  estabelecimento: Estabelecimento;

  @Column({ name: 'tipo' })
  tipo: number;
}

export default ContaCorrente;