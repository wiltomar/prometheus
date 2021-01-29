import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Basex from './basex';
import UF from './uf';

@Entity('municípios')
class Municipio extends Basex {
  @Column({ name: 'descrição' })
  nome: string;

  @OneToOne(() => UF, (uf) => uf.id)
  @JoinColumn({ name: 'uf' })
  uf: UF;
}

export default Municipio;
