import { Entity, Column } from 'typeorm';
import Basex from './basex';

@Entity('históricos')
class Historico extends Basex {
  @Column({ name: 'descrição' })
  nome: string;

  @Column({ name: 'nível' })
  nivel: string;
  
  @Column({ name: 'natureza' })
  natureza: number;
  
  @Column({ name: 'tipo' })
  tipo: number;
  
  @Column({ name: 'analítico' })
  analitico: boolean;
}

export const enum HistoricoTipo {
  Venda = 16,
  Adiantamento = 150,
  Compra = 201
}

export default Historico;
