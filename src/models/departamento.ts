import { Entity, Column } from 'typeorm';
import Base from './base';

@Entity('Mosaico.Departamento')
class Departamento extends Base {
  @Column()
  nome: string;
  
  @Column()
  ativo: boolean;

  @Column()
  venda: boolean;
}

export default Departamento;
