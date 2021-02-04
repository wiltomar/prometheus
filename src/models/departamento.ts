import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import Basex from './basex';

@Entity('setores')
class Departamento extends Basex {
  @Column({ name: 'descrição' })
  nome: string;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @Column({ name: 'venda' })
  venda: boolean;
}

@Entity('setores')
export class DepartamentoR {
  @PrimaryGeneratedColumn({ name: 'código' })
  id: number;

  @Column({ name: 'descrição' })
  nome: string;
}

export default Departamento;
