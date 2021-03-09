import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';
import Base from './base';

@Entity('Mosaico.Preco')
class Preco extends Base {
  @Column()
  nome: string;
}

@Entity('precos')
export class PrecoR {
  @PrimaryGeneratedColumn({ name: 'precoid' })
  id: number;

  @Column({ name: 'preconome' })
  nome: string;
}

export default Preco;
