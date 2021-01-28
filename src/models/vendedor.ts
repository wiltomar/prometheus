import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Base from './base';
import Estabelecimento from './estabelecimento';

@Entity('Mosaico.Vendedor')
class Vendedor extends Base {
  @Column({ length: 60 })
  nome: string;

  @Column()
  ativo: boolean;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'estabelecimentoid' })
  estabelecimento: Estabelecimento;

  @Column()
  atendente: boolean;

  @Column()
  usuario: boolean;
  
  @Column()
  funcionario: boolean;

  @Column()
  corretor: boolean;

  @Column()
  entregador: boolean;  

  @Column()
  comissao: number;

  @Column({ length: 120 })
  telefones: string;

  @Column({ length: 120 })
  celulares: string;

  @Column({ length: 120 })
  email: string;  
}

export default Vendedor;
