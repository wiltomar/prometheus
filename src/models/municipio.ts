import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Base from './base';
import UF from './uf';

@Entity('Mosaico.Municipio')
class Municipio extends Base {
  @Column()
  nome: string;

  @OneToOne(() => UF, (uf) => uf.id)
  @JoinColumn({ name: 'UFID' })
  uf: UF;
}

export default Municipio;
