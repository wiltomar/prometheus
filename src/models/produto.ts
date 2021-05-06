import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn, AfterLoad } from 'typeorm';
import Basex from './basex';
import Categoria from './categoria';

@Entity('produtos')
class Produto extends Basex {
  @Column({ name: 'descrição' })
  nome: string;

  @Column({ name: 'apelido' })
  apelido: string;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @Column({ name: 'tipo' })
  tipo: string;

  @OneToOne(() => Categoria, (categoria) => categoria.id)
  @JoinColumn({ name: 'categoria' })
  categoria: Categoria;

  @Column({ name: 'une' })
  un: string;

  @Column({ name: 'disponível' })
  venda: boolean;

  preco: number;

  @AfterLoad()
  setPreco() {
    this.preco = 0; 
  }
}

@Entity('produtos')
export class ProdutoR {
  @PrimaryGeneratedColumn({ name: 'código' })
  id: number;

  @Column({ name: 'descrição' })
  nome: string;

  @Column({ name: 'une' })
  un: string;
}

export default Produto;
