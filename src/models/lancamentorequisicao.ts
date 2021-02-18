import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import Base from './base';
import Lancamento from './lancamento';
import Conexao from './conexao';
import Integradora from './integradora';

@Entity('lançamentos_requisições')
export class LancamentoRequisicao extends Base {
  @ManyToOne(() => Lancamento, (lancamento) => lancamento.id)
  @JoinColumn({ name: 'lancamentoid', referencedColumnName: 'id' })
  lancamento: Lancamento;

  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexaoid' })
  conexao: Conexao;

  @Column({ name: 'recurso' })
  recurso: string;

  @Column({ name: 'metodo' })
  metodo: string;

  @Column({ name: 'requisicao' })
  requisicao: string;

  @Column({ name: 'resposta' })
  resposta: string;

  @Column({ name: 'situacao' })
  situacao: number;
}
export default LancamentoRequisicao;
