import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
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
import Operacao from './operacao';

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

  @Column({ name: 'valordolançamento', type: 'money' })
  subtotal: number;

  @Column({ name: 'abatimento', type: 'money' })
  desconto: number;

  @Column({ name: 'abatimento_percentual', type: 'real' })
  descontoPercentual: number;

  @Column({ name: 'bonificacao', type: 'money' })
  @Column()
  bonificacao: number;

  @Column({ name: 'encargos', type: 'money' })
  taxaServico: number;

  @Column({ name: 'valordofrete', type: 'money' })
  taxaEntrega: number;

  @Column({ name: 'valortotal', type: 'money' })
  total: number;

  @Column({ name: 'situacao' })
  situacao: number;

  @Column({ name: 'modelo' })
  modelo: string;

  @Column({ name: 'integradora' })
  integradora: number;

  @OneToOne(() => Operacao, (operacao) => operacao.id, { cascade: true })
  @JoinColumn({ name: 'operacao', referencedColumnName: 'id' })
  operacao: Operacao;
  
  // @OneToOne(() => NaturezaOperacao, (nfeNaturezaOperacao) => nfeNaturezaOperacao.id, { cascade: true })
  // @JoinColumn({ name: 'nfe_naturezaoperacao', referencedColumnName: 'id' })
  // naturezaOperacao: NaturezaOperacao;

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