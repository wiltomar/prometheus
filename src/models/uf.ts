import { Entity, Column } from 'typeorm';
import Base from './base';

@Entity('Mosaico.UF')
class UF extends Base {
  @Column()
  nome: string;

  @Column()
  sigla: string;
}

export default UF;
