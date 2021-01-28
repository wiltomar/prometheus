import { Entity, Column, OneToOne, JoinColumn, OneToMany, JoinTable } from 'typeorm';
import Base from './base';
import Cliente from './cliente';
import Conexao from './conexao';
import Conta from './conta';
import Estabelecimento from './estabelecimento';
import Historico from './historico';
import Pedido from './pedido';
import Vendedor from './vendedor';

@Entity('Mosaico.Lancamento')
class Lancamento extends Base {  
  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexaoid' })
  conexao: Conexao;

  @Column()
  tipo: number;

  @Column()
  atendimento: number;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'estabelecimentoid' })
  estabelecimento: Estabelecimento;

  @OneToOne(() => Historico, (historico) => historico.id)
  @JoinColumn({ name: 'historicoid' })
  historico: Historico;
  
  @OneToOne(() => Cliente, (cliente) => cliente.id)
  @JoinColumn({ name: 'clienteid' })
  cliente: Cliente;

  @Column()
  memorando: string;

  @Column()
  emissao: Date;  

  @Column()
  subtotal: number;

  @Column()
  desconto: number;

  @Column()
  descontoPercentual: number;

  @Column()
  bonificacao: number;

  @Column({ name: 'taxadeservico' })
  taxaServico: number;

  @Column({ name: 'taxadeentrega' })
  taxaEntrega: number;

  @Column()
  total: number;

  @OneToOne(() => Vendedor, (vendedor) => vendedor.id)
  @JoinColumn({ name: 'vendedorid' })
  vendedor: Vendedor;

  @OneToMany(() => Pedido, (pedido) => pedido.lancamento, { cascade: true, eager: true })
  pedidos: Pedido[];

  @OneToMany(() => Conta, conta => conta.lancamento, { cascade: true, eager: true })
  contas: Conta[];
}

export default Lancamento;
