import { Entity, Column } from 'typeorm';
import Basex from './basex';

@Entity('tiposdecliente')
class ClienteTipo extends Basex {
  @Column({ name: 'descrição' })
  nome: string;
}

export default ClienteTipo;
