import {
  Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn,
} from 'typeorm';
import Base from './base';
import Categoria from './categoria';

@Entity('Mosaico.Produto')
class Produto extends Base {
  @Column()
  nome: string;

  @Column()
  apelido: string;

  @Column()
  status: number;

  @Column()
  ativo: boolean;

  @Column()
  tipo: string;

  @OneToOne(() => Categoria, (categoria) => categoria.id)
  @JoinColumn({ name: 'categoriaID' })
  categoria: Categoria;

  @Column()
  categoriaID: number;

  @Column()
  un: string;

  @Column()
  venda: boolean;
}

export default Produto;
