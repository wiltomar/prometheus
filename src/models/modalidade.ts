import { Entity, Column } from 'typeorm';
import Base from './base';

@Entity('mosaico.modalidade')
class Modalidade extends Base {

  @Column()
  nome: string;

  @Column()
  sigla: string;
  
}

@Entity('mosaico.modalidade')
export class ModalidadeR extends Base {

  @Column()
  nome: string;

}

export default Modalidade;