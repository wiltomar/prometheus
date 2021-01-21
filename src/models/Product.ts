import {
  Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, CreateDateColumn,
  UpdateDateColumn, OneToOne,
} from 'typeorm';
import Category from './Category';

@Entity('vwProdutos')
class Product {
  @PrimaryGeneratedColumn('increment')
  ProdutoID: number;

  @Column()
  ProdutoNome: string;

  @Column()
  ProdutoApelido: string;

  @Column()
  ProdutoNCM: number;

  @Column()
  ProdutoGTIN: number;

  @CreateDateColumn()
  Inclusao: Date;

  @UpdateDateColumn()
  Edicao: Date;

  @Column()
  Status: number;

  @Column()
  Ativo: boolean;

  @Column()
  Tipo2: string;

  @OneToOne(() => Category, (category) => category.CategoriaID)
  Categoria: Category;

  @Column()
  CategoriaID: number;

  @Column()
  UN: string;

  @Column()
  Venda: boolean;

  @Column()
  ImagemCaminho: string;

  @Column()
  Validade: Date;
}

export default Product;
