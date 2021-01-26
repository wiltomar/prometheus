import { Entity, Column } from 'typeorm';
import Base from './base';

@Entity('Mosaico.Historico')
class Historico extends Base {
  @Column()
  nome: string;

  @Column()
  nivel: string;
  
  @Column()
  natureza: number;
  
  @Column()
  tipo: number;
  
  @Column()
  analitico: boolean;
}

export const enum HistoricoTipo {
  Venda = 16,
  Adiantamento = 150,
  Compra = 201
}

export default Historico;
