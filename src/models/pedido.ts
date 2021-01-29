import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Basex from './basex';
import Lancamento from './lancamento';
import Conexao from './conexao';
import Estabelecimento from './estabelecimento';
import Vendedor from './vendedor';
import PedidoProduto from './pedidoproduto';

@Entity('pedidos')
class Pedido extends Basex {
  @ManyToOne(() => Lancamento, (lancamento) => lancamento.pedidos)
  @JoinColumn({ name: 'lançamento' })
  lancamento: Lancamento;

  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexão' })
  conexao: Conexao;

  @Column({ name: 'tipo' })
  tipo: number;

  @Column({ name: 'natureza' })
  natureza: number;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'unidade' })
  estabelecimento: Estabelecimento;

  @Column({ name: 'datadarequisição' })
  requisicao: Date;

  @Column({ name: 'datadaentrega' })
  entrega: Date;

  @Column({ name: 'emissao' })
  emissao: Date;

  @OneToOne(() => Vendedor, (vendedor) => vendedor.id)
  @JoinColumn({ name: 'vendedor' })
  vendedor: Vendedor;

  @JoinColumn({ name: 'comissão' })
  vendedorComissao: number;

  @Column({ name: 'vendedorcomissaovalor' })
  vendedorComissaoValor: number;

  @Column({ name: 'complemento' })
  complemento: string;

  @OneToMany(() => PedidoProduto, (pedidoProduto) => pedidoProduto.pedido, { cascade: true, eager: true })
  pedidoProdutos: PedidoProduto[];
}

export default Pedido;
