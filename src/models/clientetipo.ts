import { Entity, Column } from 'typeorm';
import Base from './base';

@Entity('Mosaico.ClienteTipo')
class ClienteTipo extends Base {
  @Column()
  nome: string;
}

export default ClienteTipo;
