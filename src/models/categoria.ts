import {
  Entity, Column, JoinColumn, OneToMany,
} from 'typeorm';
import Base from './base';

@Entity('Mosaico.Categoria')
class Categoria extends Base {
  @Column()
  nome: string;

  @Column()
  apelido: string;

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
