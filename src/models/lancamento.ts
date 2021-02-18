import { Entity, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import Basex from './basex';
import { ClienteR } from './cliente';
import Conexao from './conexao';
import Conta from './conta';
import { EstabelecimentoR } from './estabelecimento';
import { HistoricoR } from './historico';
import LancamentoComplemento from './lancamentocomplemento';
import LancamentoPagamento from './lancamentopagamento';
import LancamentoRequisicao from './lancamentorequisicao';
import LancamentoSituacao from './lancamentosituacao';
import Pedido from './pedido';
import { VendedorR } from './vendedor';

@Entity('lançamentos')
class Lancamento extends Basex {  
  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexão' })
  conexao: Conexao;

  @Column({ name: 'tipo' })  
  tipo: number;

  @Column({ name: 'atendimento' })
  atendimento: number;

  @OneToOne(() => EstabelecimentoR, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'unidade' })
  estabelecimento: EstabelecimentoR;

  @OneToOne(() => HistoricoR, (historico) => historico.id)
  @JoinColumn({ name: 'histórico' })
  historico: HistoricoR;
  
  @OneToOne(() => ClienteR, (cliente) => cliente.id)
  @JoinColumn({ name: 'cliente' })
  cliente: ClienteR;

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

  @Column({ name: 'situacao' })
  situacao: number;

  @OneToOne(() => VendedorR, (vendedor) => vendedor.id, { cascade: true })
  @JoinColumn({ name: 'vendedor', referencedColumnName: 'id' })
  vendedor: VendedorR;

  @OneToOne(type => LancamentoComplemento, complemento => complemento.lancamento)
  complemento: LancamentoComplemento;

  @OneToMany(() => Pedido, (pedido) => pedido.lancamento, { cascade: true })
  @JoinColumn({ name: 'lançamento', referencedColumnName: 'código' })
  pedidos: Pedido[];

  @OneToMany(() => LancamentoPagamento, (pagamento) => pagamento.lancamento, { cascade: true })
  @JoinColumn({ name: 'lancamentoid', referencedColumnName: 'código' })
  pagamentos: LancamentoPagamento[];

  @OneToMany(() => Conta, (conta) => conta.lancamento, { cascade: true })
  @JoinColumn({ name: 'lançamento', referencedColumnName: 'código' })
  contas: Conta[];

  @OneToMany(() => LancamentoSituacao, (situacao) => situacao.lancamento, { cascade: true })
  @JoinColumn({ name: 'lancamentoid', referencedColumnName: 'código' })
  situacoes: LancamentoSituacao[];

  @OneToMany(() => LancamentoRequisicao, (requisicao) => requisicao.lancamento, { cascade: true })
  @JoinColumn({ name: 'lancamentoid', referencedColumnName: 'código' })
  requisicoes: LancamentoRequisicao[];
}

export enum LancamentoSituacaoConstantes {
  Pendente = 10,
  Confirmado = 30,
  Produzido = 40,
  Expedido = 60,
  Encerrado = 70,
  Cancelado = 90
}

export default Lancamento;