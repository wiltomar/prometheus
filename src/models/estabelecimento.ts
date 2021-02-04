import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import Basex from './basex';

@Entity('unidades')
class Estabelecimento extends Basex {
  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'ativo' })
  ativo: boolean;
}

@Entity('unidades')
export class EstabelecimentoR {
  @PrimaryGeneratedColumn({ name: 'código' })
  id: number;

  @Column({ name: 'nome' })
  nome: string;
}

export default Estabelecimento;