import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('vwCategorias')
class Category {
  @PrimaryGeneratedColumn('increment')
  CategoriaID: number;

  @Column()
  CategoriaNome: string;

  @CreateDateColumn()
  Inclusao: Date;

  @UpdateDateColumn()
  Edicao: Date;

  @Column()
  Status: number;

  @Column()
  Favorito: boolean;

  @OneToMany(() => Category, (category) => category.CategoriaPaiID)
  @JoinColumn({ name: 'CategoriaPaiID' })
  CategoriaPai: Category;

  @Column()
  CategoriaPaiID: number;

  @Column()
  Compra: boolean;

  @Column()
  Venda: boolean;
}

export default Category;
