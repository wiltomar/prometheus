import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Basex from './basex';
import Estabelecimento from './estabelecimento';

@Entity('fornecedores')
class Pessoa extends Basex {
  @Column({ name: 'nome', length: 60 })
  nome: string;

  @Column({ name: 'ativo' })
  ativo: boolean;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'unidade' })
  estabelecimento: Estabelecimento;
   
  @Column({ name: 'vendedor' })
  atendente: boolean;

  @Column({ name: 'usuário' })
  usuario: boolean;
  
  @Column({ name: 'funcionário' })
  funcionario: boolean;

  @Column({ name: 'corretor' })
  corretor: boolean;

  @Column({ name: 'entregador' })
  entregador: boolean;  

  @Column({ name: 'comissão' })
  comissao: number;

  @Column({ name: 'telefones', length: 120 })
  telefones: string;

  @Column({ name: 'celulares', length: 120 })
  celulares: string;

  @Column({ name: 'email', length: 120 })
  email: string;  
}

export default Pessoa;
