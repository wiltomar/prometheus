import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import Base from './base';
import PagamentoForma from './pagamentoforma';

@Entity('Mosaico.PagamentoPlano')
class PagamentoPlano extends Base {
  @Column()
  nome: string;

  @Column()
  sigla: string;

  @Column()
  ativo: boolean;

  @Column()
  natureza: number;

  @Column()
  parcelas: number;

  @Column()
  entrada: boolean;

  @Column()
  dias: number;

  @Column()
  dias2: number;

  @Column()
  tef: boolean;

  @OneToOne(() => PagamentoForma, (pagamentoForma) => pagamentoForma.id)
  @JoinColumn({ name: 'pagamentoformaid' })
  pagamentoForma: PagamentoForma;
}

@Entity('planosdepagamento')
export class PagamentoPlanoR {
  @PrimaryGeneratedColumn({ name: 'código' })
  id: number;

  @Column({ name: 'descrição' })
  nome: string;
}

export default PagamentoPlano;
