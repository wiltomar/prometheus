import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
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

export enum Especie {
  Dinheiro = 1,
  Cheque = 2,
  Cartao = 3,
  Boleto = 4
}

@Entity('formasdepagamento')
export class PagamentoFormaR {
  @PrimaryGeneratedColumn({ name: 'código' })
  id: number;

  @Column({ name: 'descrição' })
  nome: string;
}

export default PagamentoForma;
