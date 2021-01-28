import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Base from './base';
import Pessoa from './pessoa';

@Entity('Mosaico.LancamentoVenda')
class LancamentoVenda extends Base {
  @OneToOne(() => Pessoa, (vendedor) => vendedor.id)
  @JoinColumn({ name: 'vendedorid' })
  vendedor: Pessoa;

  @OneToOne(() => Pessoa, (entregador) => entregador.id)
  @JoinColumn({ name: 'entregadorid' })
  entregador: Pessoa;

  @Column()
  bloqueado: boolean;

  @Column()
  credito: number;
}

export default LancamentoVenda;
