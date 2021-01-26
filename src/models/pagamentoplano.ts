import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Base from './base';
import PagamentoForma from './pagamentoforma';

@Entity('Mosaico.PagamentoPlano')
class PagamentoPlano extends Base {
  @Column()
  nome: string;

  @Column()
  sigla: string;

  @Column()
  ativo: boolean;

  @Column()
  natureza: number;

  @Column()
  parcelas: number;

  @Column()
  entrada: boolean;

  @Column()
  dias: number;

  @Column()
  dias2: number;

  @Column()
  tef: boolean;

  @OneToOne(() => PagamentoForma, (pagamentoforma) => pagamentoforma.id)
  @JoinColumn({ name: 'pagamentoformaid' })
  pagamentoforma: PagamentoForma;
}

export default PagamentoPlano;
