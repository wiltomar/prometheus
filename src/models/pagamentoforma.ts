import { Entity, Column } from 'typeorm';
import Base from './base';

@Entity('Mosaico.PagamentoForma')
class PagamentoForma extends Base {
  @Column()
  nome: string;

  @Column()
  sigla: string;

  @Column()
  ativo: boolean;

  @Column()
  troco: boolean;

  @Column()
  especie: number;

  @Column()
  operacao: number;  
}

export const enum Especie {
  Dinheiro = 1,
  Cheque = 2,
  Cartao = 3,
  Boleto = 4
}

export default PagamentoForma;