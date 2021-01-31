import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import Basex from './basex';
import Cliente from './cliente';
import Conexao from './conexao';
import Conta from './conta';
import Estabelecimento from './estabelecimento';
import Historico from './historico';
import Pedido from './pedido';
import Vendedor from './vendedor';

@Entity('lançamentos')
class Lancamento extends Basex {  
  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexão' })
  conexao: Conexao;

  @Column({ name: 'tipo' })  
  tipo: number;

  @Column({ name: 'atendimento' })
  atendimento: number;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'unidade' })
  estabelecimento: Estabelecimento;

  @OneToOne(() => Historico, (historico) => historico.id)
  @JoinColumn({ name: 'histórico' })
  historico: Historico;
  
  @OneToOne(() => Cliente, (cliente) => cliente.id)
  @JoinColumn({ name: 'cliente' })
  cliente: Cliente;

  @Column({ name: 'memorando' })
  memorando: string;

  @Column({ name: 'datadeemissão' })
  emissao: Date;  

  @Column({ name: 'valordolançamento' })
  subtotal: number;

  @Column({ name: 'abatimento' })
  desconto: number;

  @Column({ name: 'abatimento_percentual' })
  descontoPercentual: number;

  @Column({ name: 'bonificacao' })
  @Column()
  bonificacao: number;

  @Column({ name: 'encargos' })
  taxaServico: number;

  @Column({ name: 'valordofrete' })
  taxaEntrega: number;

  @Column({ name: 'valortotal' })
  total: number;

  @OneToOne(() => Vendedor, (vendedor) => vendedor.id)
  @JoinColumn({ name: 'vendedor', referencedColumnName: 'id' })
  vendedor: Vendedor;

  @OneToMany(() => Pedido, (pedido) => pedido.lancamento, { cascade: true })
  @JoinColumn({ name: 'lançamento', referencedColumnName: 'código' })
  pedidos: Pedido[];

  @OneToMany(() => Conta, conta => conta.lancamento, { cascade: true })
  @JoinColumn({ name: 'lançamento', referencedColumnName: 'código' })
  contas: Conta[];
}

export default Lancamento;
