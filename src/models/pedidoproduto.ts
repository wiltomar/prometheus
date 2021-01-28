import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import Base from './base';
import Pedido from './pedido';
import Conexao from './conexao';
import Estabelecimento from './estabelecimento';
import Departamento from './departamento';
import Produto from './produto';

@Entity('Mosaico.PedidoProduto')
class PedidoProduto extends Base {
  @ManyToOne(() => Pedido, pedido => pedido.pedidoProdutos)
  pedido: Pedido;

  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexaoid' })
  conexao: Conexao;

  /// lancamentoid

  @Column()
  item: number;

  @Column()
  subitem: number;

  @Column()
  itemTitular: number;

  @Column()
  tipo: number;

  @Column()
  atendimento: number;

  @Column()
  natureza: number;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'estabelecimentoid' })
  estabelecimento: Estabelecimento;

  @OneToOne(() => Departamento, (departamento) => departamento.id)
  @JoinColumn({ name: 'departamentoid' })
  departamento: Departamento;

  @Column()
  entrega: Date;

  @Column()
  emissao: Date;

  @OneToOne(() => Produto, (produto) => produto.id)
  @JoinColumn({ name: 'produtoid' })
  produto: Produto;

  @Column()
  qde: number;

  @Column()
  fator: number;

  @Column()
  preco: number;

  @Column()
  desconto: number;

  @Column()
  precoTotal: number;

  @Column()
  comissionado: boolean;

  @Column()
  observacoes: string;
}

export default PedidoProduto;