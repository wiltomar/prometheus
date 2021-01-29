import { Entity, Column } from 'typeorm';
import Basex from './basex';

@Entity('unidades')
class Estabelecimento extends Basex {
  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'ativo' })
  ativo: boolean;
}

export default Estabelecimento;