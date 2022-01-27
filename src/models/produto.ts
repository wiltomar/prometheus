import { EstabelecimentoR } from './estabelecimento';
import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn, AfterLoad, PrimaryColumn } from 'typeorm';
import Basex from './basex';
import Categoria from './categoria';
import { DepartamentoR } from './departamento';
import { ImpressoraR } from './impressora';

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

  @Column({ name: 'comissionado' })
  comissionado: boolean;

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

// @Entity('produtos_ambientes')
// export class ProdutoAmbiente {
//   @OneToOne(() => ProdutoR, (produto) => produto.id)
//   @JoinColumn({ name: 'produto' })
//   produto: ProdutoR;

//   @OneToOne(() => EstabelecimentoR, (estabelecimento) => estabelecimento.id)
//   @JoinColumn({ name: 'unidade' })
//   estabelecimento: EstabelecimentoR;

//   @Column({ name: 'ambiente' })
//   ambienteid: number;

//   @OneToOne(() => DepartamentoR, (departamento) => departamento.id)
//   @JoinColumn({ name: 'departamento' })
//   departamento: DepartamentoR;

//   @OneToOne(() => ImpressoraR, (impressora) => impressora.id)
//   @JoinColumn({ name: 'impressora' })
//   impressora: ImpressoraR;
// }

export default Produto;
