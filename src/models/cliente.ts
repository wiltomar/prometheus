import {
  Entity, Column, OneToOne, JoinColumn,
} from 'typeorm';
import Base from './base';
import Estabelecimento from './estabelecimento';
import ClienteTipo from './clientetipo';
import Preco from './preco';
import Municipio from './municipio';

@Entity('Mosaico.Cliente')
class Cliente extends Base {
  @Column({ length: 60 })
  nome: string;

  @Column({ length: 20 })
  apelido: string;

  @Column()
  ativo: boolean;

  @Column({ length: 16 })
  senha: string;

  @OneToOne(() => Estabelecimento, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'estabelecimentoid' })
  estabelecimento: Estabelecimento;

  @OneToOne(() => ClienteTipo, (clientetipo) => clientetipo.id)
  @JoinColumn({ name: 'clientetipoid' })
  clientetipo: ClienteTipo;

  @OneToOne(() => Preco, (preco) => preco.id)
  @JoinColumn({ name: 'precoid' })
  preco: Preco;

  @Column()
  desconto: number;

  @Column({ length: 80 })
  endereco: string;

  @Column()
  enderecoNumero: string;

  @Column({ length: 80 })
  enderecoComplemento: string;

  @Column({ length: 40 })
  enderecoBairro: string;

  @Column({ length: 40 })
  enderecoCidade: string;

  @Column({ length: 2 })
  enderecoUF: string;

  @Column({ length: 8 })
  enderecoCEP: string;

  @Column({ length: 80 })
  enderecoReferencia: string;

  @OneToOne(() => Municipio, (municipio) => municipio.id)
  @JoinColumn({ name: 'municipioid' })
  municipio: Municipio;

  @Column({ length: 120 })
  telefones: string;

  @Column({ length: 120 })
  celulares: string;

  @Column({ length: 160 })
  email: string;

  @Column()
  credito: number;

  @Column()
  cpf: number;

  @Column()
  cnpj: number;

  @Column()
  ie: number;

  @Column({ length: 100 })
  razaoSocial: string;

  @Column()
  sexo: number;

  @Column({ length: 40 })
  uid: string;

  @Column({ length: 40 })
  rfid: string;

  @Column()
  observacoes: string;
}

export default Cliente;
