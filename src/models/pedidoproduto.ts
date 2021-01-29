import { Entity, Column, OneToOne, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import Conexao from './conexao';
import Estabelecimento from './estabelecimento';
import Departamento from './departamento';
import Produto from './produto';
import Pedido from './pedido';

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

  @ManyToOne(() => Pedido, (pedido) => pedido.pedidoProdutos)
  @JoinColumn({ name: 'pedido' })
  pedido: Pedido;	

  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexaoid' })
  conexao: Conexao;

  @Column({ name: 'item' })
  item: number;

  @Column({ name: 'subitem' })
  @Column()
  subitem: number;

  @Column({ name: 'itemorigem' })
  itemTitular: number;

  @Column({ name: 'tipo' })
  @Column()
  tipo: number;

  @Column({ name: 'atendimento' })
  atendimento: number;

  @Column({ name: 'natureza' })
  natureza: number;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'unidade' })
  estabelecimento: Estabelecimento;

  @OneToOne(() => Departamento, (departamento) => departamento.id)
  @JoinColumn({ name: 'setor' })
  departamento: Departamento;

  @Column({ name: 'entrega' })
  entrega: Date;

  @Column({ name: 'emissao' })
  emissao: Date;

  @OneToOne(() => Produto, (produto) => produto.id)
  @JoinColumn({ name: 'produto' })
  produto: Produto;

  @Column({ name: 'qde' })
  qde: number;

  @Column({ name: 'fator' })
  fator: number;

  @Column({ name: 'preço' })
  preco: number;

  @Column({ name: 'desconto' })
  desconto: number;

  @Column({ name: 'preçototal' })
  precoTotal: number;

  @Column({ name: 'comissionado' })
  comissionado: boolean;

  @Column({ name: 'observações' })
  observacoes: string;
}

export default PedidoProduto;
