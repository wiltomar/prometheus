import {
  Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany,
} from 'typeorm';
import Base from './base';
import Lancamento from './lancamento';
import Conexao from './conexao';
import Estabelecimento from './estabelecimento';
import Vendedor from './vendedor';
import PedidoProduto from './pedidoproduto';

@Entity('Mosaico.Pedido')
class Pedido extends Base {
  @ManyToOne(() => Lancamento, (lancamento) => lancamento.pedidos)
  lancamento: Lancamento;

  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexaoid' })
  conexao: Conexao;

  @Column()
  tipo: number;

  @Column()
  natureza: number;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'estabelecimentoid' })
  estabelecimento: Estabelecimento;

  @Column()
  requisicao: Date;

  @Column()
  entrega: Date;

  @Column()
  emissao: Date;

  @OneToOne(() => Vendedor, (vendedor) => vendedor.id)
  @JoinColumn({ name: 'vendedorid' })
  vendedor: Vendedor;

  @Column()
  vendedorComissao: number;

  @Column()
  vendedorComissaoValor: number;

  @Column()
  complemento: string;

  @OneToMany(() => PedidoProduto, (pedidoProduto) => pedidoProduto.pedido, { cascade: true, eager: true })
  pedidoProdutos: PedidoProduto[];
}

export default Pedido;
