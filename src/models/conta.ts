import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import Basex from './basex';
import Lancamento from './lancamento';
import Conexao from './conexao';
import PagamentoForma from './pagamentoforma';
import ContaCorrente from './contacorrente';

@Entity('contas')
class Conta extends Basex {
  @ManyToOne(() => Lancamento, lancamento => lancamento.contas)
  @JoinColumn({ name: 'lançamento' })
  lancamento: Lancamento;

  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexão' })
  conexao: Conexao;

  @Column({ name: 'natureza' })
  natureza: number;
  
  @Column({ name: 'datadevencimento' })
  vencimento: Date;

  @Column({ name: 'valordaconta', type: 'money' })
  valor: number;
  
  @OneToOne(() => PagamentoForma, (pagamentoforma) => pagamentoforma.id)
  @JoinColumn({ name: 'formadepagamento' })
  pagamentoforma: PagamentoForma;

  @Column({ name: 'dataderecebimento' })
  recebimento: Date;
  
  @Column({ name: 'datadepagamento' })
  pagamento: Date;

  @Column({ name: 'acréscimos', type: 'money' })
  acrescimos: number;

  @Column({ name: 'descontos', type: 'money' })
  descontos: number;

  @Column({ name: 'valorpago', type: 'money' })
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