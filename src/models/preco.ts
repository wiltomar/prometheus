import { Entity, Column } from 'typeorm';
import Base from './base';

@Entity('Mosaico.Preco')
class Preco extends Base {
  @Column()
  nome: string;

  @Column()
  status: number;
}

export default Preco;
