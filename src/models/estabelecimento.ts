import { Entity, Column } from 'typeorm';
import Base from './base';

@Entity('Mosaico.Estabelecimento')
class Estabelecimento extends Base {
  @Column()
  nome: string;

  @Column()
  ativo: boolean;
}

export default Estabelecimento;
