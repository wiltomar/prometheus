import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Basex from './basex';
import Lancamento from './lancamento';
import Conexao from './conexao';
import { EstabelecimentoR } from './estabelecimento';
import { VendedorR } from './vendedor';
import PedidoProduto from './pedidoproduto';

@Entity('pedidos')
class Pedido extends Basex {
  @ManyToOne(() => Lancamento, lancamento => lancamento.id)
  @JoinColumn({ name: 'lançamento', referencedColumnName: 'id' })
  lancamento: Lancamento;

  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexão' })
  conexao: Conexao;

  @Column({ name: 'tipo' })
  tipo: number;

  @Column({ name: 'natureza' })
  natureza: number;

  @OneToOne(() => EstabelecimentoR, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'unidade' })
  estabelecimento: EstabelecimentoR;

  @Column({ name: 'datadarequisição' })
  requisicao: Date;

  @Column({ name: 'datadaentrega' })
  entrega: Date;

  @Column({ name: 'emissao' })
  emissao: Date;

  @OneToOne(() => VendedorR, (vendedor) => vendedor.id)
  @JoinColumn({ name: 'vendedor' })
  vendedor: VendedorR;

  @JoinColumn({ name: 'comissão' })
  vendedorComissao: number;

  @Column({ name: 'vendedorcomissaovalor', type: 'money' })
  vendedorComissaoValor: number;

  @Column({ name: 'complemento' })
  complemento: string;

  @OneToMany(() => PedidoProduto, (pedidoProduto) => pedidoProduto.pedido, { cascade: true })
  pedidoProdutos: PedidoProduto[];
}

export default Pedido;
