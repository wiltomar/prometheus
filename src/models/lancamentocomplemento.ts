import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Base from './base';
import Lancamento from './lancamento';
import Conexao from './conexao';
import Integradora from './integradora';

@Entity('lançamentos_complementos')
export class LancamentoComplemento extends Base {
  @OneToOne(type => Lancamento)
  @JoinColumn()
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

export default LancamentoComplemento;


export enum LancamentoComplementoSituacao {
  Pendente = 10,
  Confirmado = 30,
  Produzido = 40,
  Expedido = 60,
  Encerrado = 70,
  Cancelado = 90
}
