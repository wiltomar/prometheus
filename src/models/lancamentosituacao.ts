import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import Base from './base';
import Lancamento from './lancamento';
import Conexao from './conexao';

@Entity('lançamentos_situações')
export class LancamentoSituacao extends Base {
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

  @Column({ name: 'catracasituacao' })
  catracaSituacao: number;

  @Column({ name: 'catracatentativas' })
  catracaTentativas: number;

  @Column({ name: 'entreganotificada' })
  entregaNotificada: boolean;

  @Column({ name: 'entregasituacao' })
  entregaSituacao: boolean;

  @Column({ name: 'entregatentativas' })
  entregaTentarivas: boolean;
}

export default LancamentoSituacao;
