import { Entity, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import Basex from './basex';
import { ClienteR } from './cliente';
import Conexao from './conexao';
import Conta from './conta';
import { EstabelecimentoR } from './estabelecimento';
import { HistoricoR } from './historico';
import Integradora from './integradora';
import LancamentoPagamento from './lancamentopagamento';
import Pedido from './pedido';
import { VendedorR } from './vendedor';

export enum LancamentoSituacaoConstantes {
  Pendente = 10,
  Confirmado = 20,
  Produzido = 30,
  Expedido = 40,
  Encerrado = 70,
  Cancelado = 90
}

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

  @OneToOne(() => LancamentoComplemento, (complemento) => complemento.lancamento, { cascade: true })
  @JoinColumn({ name: 'lancamentoid', referencedColumnName: 'código' })
  complemento: LancamentoComplemento[];

  @OneToMany(() => LancamentoRequisicao, (requisicao) => requisicao.lancamento, { cascade: true })
  @JoinColumn({ name: 'lancamentoid', referencedColumnName: 'código' })
  requisicoes: LancamentoRequisicao[];
}

@Entity('lançamentos_situações')
export class LancamentoSituacao extends Basex {
  @ManyToOne(() => Lancamento, (lancamento) => lancamento.id)
  @JoinColumn({ name: 'lancamentoid', referencedColumnName: 'id' })
  lancamento: Lancamento;

  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexaoid' })
  conexao: Conexao;

  @Column({ name: 'situacao' })
  situacao: number;

  @Column({ name: 'momento' })
  momento: Date;

  @Column({ name: 'catracanotificada' })
  catracaNotificada: boolean;

  @Column({ name: 'entreganotificada' })
  entregaNotificada: boolean;
}

@Entity('lançamentos_complementos')
export class LancamentoComplemento extends Basex {
  @ManyToOne(() => Lancamento, (lancamento) => lancamento.id)
  @JoinColumn({ name: 'lancamentoid', referencedColumnName: 'id' })
  lancamento: Lancamento;

  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexaoid' })
  conexao: Conexao;

  @OneToOne(() => Integradora, (integradora) => integradora.id)
  @JoinColumn({ name: 'catracaintegradoraid' })
  catracaIntegradora: Integradora;

  @Column({ name: 'catracaintegradorauid' })
  catracaIntegradoraUID: string;

  @OneToOne(() => Integradora, (integradora) => integradora.id)
  @JoinColumn({ name: 'entregaintegradoraid' })
  entregaIntegradora: Integradora;

  @Column({ name: 'entregaintegradorauid' })
  entregraIntegradoraUID: string;
}

@Entity('lançamentos_requisições')
export class LancamentoRequisicao extends Basex {
  @ManyToOne(() => Lancamento, (lancamento) => lancamento.id)
  @JoinColumn({ name: 'lancamentoid', referencedColumnName: 'id' })
  lancamento: Lancamento;

  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexaoid' })
  conexao: Conexao;

  @OneToOne(() => Integradora, (integradora) => integradora.id)
  @JoinColumn({ name: 'integradoraid' })
  integradora: Integradora;

  @Column({ name: 'recurso' })
  recurso: string;

  @Column({ name: 'metodo' })
  metodo: string;

  @Column({ name: 'requisicao' })
  requisicao: string;

  @Column({ name: 'resposta' })
  resposta: string;

  @Column({ name: 'situacao' })
  situacao: string;
}

export default Lancamento;