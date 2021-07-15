import { Entity, Column } from 'typeorm';
import Base from './base';

@Entity('Mosaico.Autorizacao')
class Autorizacao extends Base {

  @Column()
  licenca: string;

  @Column()
  chave: number;

}

export default Autorizacao;
