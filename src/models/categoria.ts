import { Entity, Column, JoinColumn, OneToMany } from 'typeorm';
import XBase from '@models/basex';

@Entity('categorias')
class Categoria extends XBase {
  @Column({ name: 'descrição' })
  nome: string;

  @Column({ name: 'apelido' })
  apelido: string;

  @OneToMany(() => Categoria, (categoria) => categoria.id)
  @JoinColumn({ name: 'categoriapaiid' })
  categoriaTitular: Categoria;

  @Column({ name: 'venda' })
  venda: boolean;
}

export default Categoria;
