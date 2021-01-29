import { Entity, Column } from 'typeorm';
import Basex from './basex';

@Entity('ufs')
class UF extends Basex {
  @Column({ name: 'descrição' })
  nome: string;

  @Column({ name: 'sigla' })
  sigla: string;
}

export default UF;