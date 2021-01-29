import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Basex from './basex';
import Estabelecimento from './estabelecimento';
import Departamento from './departamento';

@Entity('computadores')
class Computador extends Basex {
  @Column({ name: 'descrição', length: 80 })
  nome: string;

  @Column({ name: 'computador', length: 30 })
  nomeSO: string;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'unidade' })
  estabelecimento: Estabelecimento;

  @OneToOne(() => Departamento, (departamento) => departamento.id)
  @JoinColumn({ name: 'setor' })
  usuario: Departamento;  

  @Column({ name: 'impressora', length: 120 })
  impressora: string;
}

export default Computador;