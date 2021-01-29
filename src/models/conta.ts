import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import Basex from './basex';
import ContaCorrente from './contacorrente';
import Lancamento from './lancamento';
import PagamentoForma from './pagamentoforma';

@Entity('contas')
class Conta extends Basex {
  @ManyToOne(() => Lancamento, lancamento => lancamento.contas)
  @JoinColumn({ name: 'lançamento' })
  lancamento: Lancamento;

  @Column({ name: 'natureza' })
  natureza: number;
  
  @Column({ name: 'datadevencimento' })
  vencimento: Date;

  @Column({ name: 'valordaconta' })
  valor: number;
  
  @OneToOne(() => PagamentoForma, (pagamentoforma) => pagamentoforma.id)
  @JoinColumn({ name: 'formadepagamento' })
  pagamentoforma: PagamentoForma;

  @Column({ name: 'dataderecebimento' })
  recebimento: Date;
  
  @Column({ name: 'datadepagamento' })
  pagamento: Date;

  @Column({ name: 'acréscimos' })
  acrescimos: number;

  @Column({ name: 'descontos' })
  descontos: number;

  @Column({ name: 'valorpago' })
  total: number;

  @OneToOne(() => ContaCorrente, (contacorrente) => contacorrente.id)
  @JoinColumn({ name: 'contacorrente' })
  contacorrente: ContaCorrente;
  
  @Column({ name: 'sp' })
  sp: number;
  
  @Column({ name: 'parcela' })
  parcela: number;

  @Column({ name: 'parcelas' })
  parcelas: number;
}

export default Conta;