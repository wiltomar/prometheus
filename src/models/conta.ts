import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Base from './base';
import Conexao from './conexao';
import ContaCorrente from './contacorrente';
import PagamentoForma from './pagamentoforma';

@Entity('Mosaico.Conta')
class Conta extends Base {
  @Column()
  natureza: number;
  
  @Column()
  vencimento: Date;

  @Column()
  valor: number;
  
  @OneToOne(() => PagamentoForma, (pagamentoforma) => pagamentoforma.id)
  @JoinColumn({ name: 'pagamentoformaid' })
  pagamentoforma: PagamentoForma;

  @Column()
  recebimento: Date;
  
  @Column()
  pagamento: Date;

  @Column()
  acrescimos: number;

  @Column()
  descontos: number;

  @Column()
  total: number;

  @OneToOne(() => ContaCorrente, (contacorrente) => contacorrente.id)
  @JoinColumn({ name: 'contacorrenteid' })
  contacorrente: ContaCorrente;
  
  @Column()
  sp: number;
  
  @Column()
  parcela: number;

  @Column()
  parcelas: number;
}

export default Conta;