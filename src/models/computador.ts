import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Base from './base';
import Estabelecimento from './estabelecimento';
import Departamento from './departamento';

@Entity('Mosaico.Computador')
class Computador extends Base {
  @Column({ length: 80 })
  nome: string;

  @Column({ length: 30 })
  nomeSO: string;

  @Column()
  ativo: boolean;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'estabelecimentoid' })
  estabelecimento: Estabelecimento;

  @OneToOne(() => Departamento, (departamento) => departamento.id)
  @JoinColumn({ name: 'departamentoid' })
  usuario: Departamento;  

  @Column({ length: 120 })
  impressora: string;
}

export default Computador;