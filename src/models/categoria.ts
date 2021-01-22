import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import Base from './base';

@Entity('Mosaico.Categoria')
class Categoria extends Base {
  @Column()
  nome: string;

  @Column()
  status: number;

  @Column()
  apelino: string;

  @Column()
  fotoBase64: boolean;

  @OneToMany(() => Categoria, (categoria) => categoria.id)
  @JoinColumn({ name: 'categoriaTitularID' })
  categoriaTitular: Categoria;

  @Column()
  categoriaTitularID: number;

  @Column()
  venda: boolean;
}

export default Categoria;
