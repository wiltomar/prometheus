import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Basex from './basex';
import { EstabelecimentoR } from './estabelecimento';
import { DepartamentoR } from './departamento';
import Preco from './preco';

@Entity('computadores')
class Computador extends Basex {
  @Column({ name: 'descrição', length: 80 })
  nome: string;

  @Column({ name: 'computador', length: 30 })
  nomeSO: string;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @OneToOne(() => EstabelecimentoR, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'unidade' })
  estabelecimento: EstabelecimentoR;

  @OneToOne(() => DepartamentoR, (departamento) => departamento.id)
  @JoinColumn({ name: 'setor' })
  departamento: DepartamentoR;  

  @Column({ name: 'impressora', length: 120 })
  impressora: string;

  @OneToOne(() => Preco, (preco) => preco.id)
  @JoinColumn({ name: 'precoid' })
  preco: Preco;

}

export const
  COMPUTADOR_PROMETHEUS = 'PROMETHEUS';

export default Computador;