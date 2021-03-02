import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import Base from './base';
import Lancamento from './lancamento';
import Integradora from './integradora';

@Entity('integracao.requisicao')
class Requisicao extends Base {
  @ManyToOne(() => Lancamento, lancamento => lancamento.contas)
  @JoinColumn({ name: 'lancamentoid' })
  lancamento: Lancamento;

  @OneToOne(() => Integradora, (integradora) => integradora.id)
  @JoinColumn({ name: 'integradoraid' })
  integradora: Integradora;

  @Column({ name: 'identificadorpequeno' })
  identificador: string;
}

export default Requisicao;