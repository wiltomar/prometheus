import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import Basex from './basex';

@Entity('impressoras')
class Impressora extends Basex {
  @Column({ name: 'descrição' })
  nome: string;
}

@Entity('impressoras')
export class ImpressoraR {
  @PrimaryGeneratedColumn({ name: 'código' })
  id: number;

  @Column({ name: 'descrição' })
  nome: string;
}

export default Impressora;
