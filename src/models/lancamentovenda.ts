import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import Lancamento from './lancamento';
import { PagamentoFormaR } from './pagamentoforma';

@Entity('lançamentos_vendas')
export class LancamentoVenda {
  @PrimaryGeneratedColumn('increment', { name: 'lancamentoid' })
  id: number;

  @OneToOne(() => Lancamento, (lancamento) => lancamento.id)
  @JoinColumn({ name: 'lancamentoid', referencedColumnName: 'id' })
  lancamento: Lancamento;

  @Column({ name: 'entreganome' })
  nome: string;

  @Column({ name: 'entregacep' })
  cep: string;

  @Column({ name: 'entregaendereco' })
  endereco: string;

  @Column({ name: 'entreganumero' })
  numero: number;

  @Column({ name: 'entregacomplemento' })
  complemento: string;
  
  @Column({ name: 'entregabairro' })
  bairro: string;

  @Column({ name: 'entregacidade' })
  cidade: string;

  @Column({ name: 'entregauf' })
  uf: string;

  @Column({ name: 'entregareferencia' })
  referencia: string;

  @Column({ name: 'entregatelefones' })
  telefones: string;

  @Column({ name: 'entregacelulares' })
  celulares: string;

  @Column({ name: 'dinheiro' })
  dinheiro: number;

  @Column({ name: 'cheque' })
  cheque: number;

  @OneToOne(() => PagamentoFormaR, (pagamentoForma) => pagamentoForma.id)
  @JoinColumn({ name: 'formadepagamento1' })
  pagamentoForma1: PagamentoFormaR;

  @Column({ name: 'valor1' })
  valor1: number;

  @OneToOne(() => PagamentoFormaR, (pagamentoForma) => pagamentoForma.id)
  @JoinColumn({ name: 'formadepagamento2' })
  pagamentoForma2: PagamentoFormaR;

  @Column({ name: 'valor2' })
  valor2: number;

  @OneToOne(() => PagamentoFormaR, (pagamentoForma) => pagamentoForma.id)
  @JoinColumn({ name: 'formadepagamento3' })
  pagamentoForma3: PagamentoFormaR;

  @Column({ name: 'valor3' })
  valor3: number;
}

export default LancamentoVenda;