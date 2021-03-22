import { Entity, Column, OneToOne, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import Pedido from './pedido';
import Conexao from './conexao';
import { EstabelecimentoR } from './estabelecimento';
import { DepartamentoR } from './departamento';
import { ProdutoR } from './produto';
import Lancamento from './lancamento';

@Entity('Pedidos_Produtos')
class PedidoProduto {
  @PrimaryGeneratedColumn('increment', { name: 'pedidoprodutoid'})
  id: number;

  @CreateDateColumn({ name: 'datadainclusão'})
  inclusao: Date;

  @CreateDateColumn({ name: 'datadeedição'})
  edicao: Date;

  @Column({ name: 'status' })
  status: number;

  @BeforeInsert()
  setCreateDate(): void {
    this.inclusao = new Date();
    this.edicao = this.inclusao;
    this.status = 0;
  }

  @BeforeUpdate()
  setUpdateDate(): void {
    this.edicao = new Date();
  }

  @ManyToOne(() => Lancamento, (lancamento) => lancamento.id)
  @JoinColumn({ name: 'lancamento', referencedColumnName: 'id' })
  lancamento: Lancamento;

  @ManyToOne(() => Pedido, (pedido) => pedido.id)
  @JoinColumn({ name: 'pedido', referencedColumnName: 'id' })
  pedido: Pedido;

  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexaoid' })
  conexao: Conexao;

  @Column({ name: 'item' })
  item: number;

  @Column('tinyint', { name: 'subitem' })
  subitem: number;

  @Column({ name: 'itemorigem' })
  itemTitular: number;

  @Column('tinyint', { name: 'tipo' })
  tipo: number;

  @Column('int', { name: 'atendimento' })
  atendimento: number;

  @Column('smallint', { name: 'natureza' })
  natureza: number;

  @OneToOne(() => EstabelecimentoR, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'unidade' })
  estabelecimento: EstabelecimentoR;

  @OneToOne(() => DepartamentoR, (departamento) => departamento.id)
  @JoinColumn({ name: 'setor' })
  departamento: DepartamentoR;

  @Column({ name: 'entrega' })
  entrega: Date;

  @Column({ name: 'emissao' })
  emissao: Date;

  @OneToOne(() => ProdutoR, (produto) => produto.id)
  @JoinColumn({ name: 'produto' })
  produto: ProdutoR;

  @Column('numeric', { name: 'qde' })
  qde: number;

  @Column({ name: 'fator' })
  fator: number;

  @Column({ name: 'fatorun' })
  fatorUN: number;

  @Column('smallmoney', { name: 'preço' })
  preco: number;

  @Column('smallmoney', { name: 'desconto' })
  desconto: number;

  @Column({ name: 'descontopercentual' })
  descontoPercentual: number;

  @Column({ name: 'preçototal' })
  precoTotal: number;

  @Column({ name: 'comissionado' })
  comissionado: boolean;

  @Column({ name: 'observações' })
  observacoes: string;
}

export default PedidoProduto;
