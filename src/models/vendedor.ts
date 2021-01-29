import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Base from './base';
import Estabelecimento from './estabelecimento';

@Entity('Mosaico.Vendedor')
class Vendedor extends Base {

  /*Código ID, Nome, DataDaInclusão Inclusao, DataDeEdição Edicao, Status, Ativo,
	Unidade EstabelecimentoID, Comissão Comissao, Foto, Senha, Vendedor,
	Vendedor Atendente */
  @Column({ name: 'nome', length: 60 })
  nome: string;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'unidade' })
  estabelecimento: Estabelecimento;

  @Column({ name: 'vendedor' })
  atendente: boolean;

  @Column({ name: 'comissão' })
  comissao: number;

  @Column({ name: 'telefones', length: 120 })
  telefones: string;

  @Column({ name: 'celulares', length: 120 })
  celulares: string;

  @Column({ name: 'email', length: 120 })
  email: string;  
}

export default Vendedor;
