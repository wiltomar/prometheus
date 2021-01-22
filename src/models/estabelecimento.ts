import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import Base from './base';

@Entity('Mosaico.Estabelecimento')
class Estabelecimento extends Base {
  @Column()
  nome: string;

  @Column()
  ativo: boolean;

  @Column()
  status: number;
}

export default Estabelecimento;
