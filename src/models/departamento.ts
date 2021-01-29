import { Entity, Column } from 'typeorm';
import Basex from './basex';

@Entity('setores')
class Departamento extends Basex {
  @Column({ name: 'descrição' })
  nome: string;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @Column({ name: 'venda' })
  venda: boolean;
}

export default Departamento;
