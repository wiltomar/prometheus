import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import Basex from './basex';
import { EstabelecimentoR } from './estabelecimento';
import { ClienteTipoR } from './clientetipo';
import { VendedorR } from './vendedor';
import { PrecoR } from './preco';
import Municipio from './municipio';

@Entity('clientes')
export class ClienteR {
  @PrimaryGeneratedColumn({ name: 'código' })
  id: number;

  @Column({ name: 'nome' })
  nome: string;
}

@Entity('clientes')
class Cliente extends Basex {
  @Column({ name: 'nome', length: 60 })
  nome: string;

  @Column({ length: 20 })
  apelido: string;

  @Column()
  ativo: boolean;

  @Column({ length: 16 })
  senha: string;

  @OneToOne(() => EstabelecimentoR, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'unidade' })
  estabelecimento: EstabelecimentoR;

  @OneToOne(() => ClienteTipoR, (clientetipo) => clientetipo.id)
  @JoinColumn({ name: 'tipodecliente' })
  clientetipo: ClienteTipoR;

  @OneToOne(() => PrecoR, (preco) => preco.id)
  @JoinColumn({ name: 'precoid' })
  preco: PrecoR;

  @OneToOne(() => VendedorR, (vendedor) => vendedor.id)
  @JoinColumn({ name: 'vendedorid' })
  vendedorid: VendedorR;

  @Column()
  desconto: number;

  @Column({ name: 'endereço', length: 80 })  
  endereco: string;

  @Column({ name: 'número' })
  enderecoNumero: string;

  @Column({ name: 'complemento', length: 80 })
  enderecoComplemento: string;

  @Column({ name: 'bairro',length: 40 })
  enderecoBairro: string;

  @Column({ name: 'cidade', length: 40 })
  enderecoCidade: string;

  @Column({ name: 'uf', length: 2 })
  enderecoUF: string;

  @Column({ name: 'cep', length: 8 })
  enderecoCEP: string;

  @Column({ name: 'referência', length: 80 })
  enderecoReferencia: string;

  @OneToOne(() => Municipio, (municipio) => municipio.id)
  @JoinColumn({ name: 'município' })
  municipio: Municipio;

  @Column({ name: 'telefones', length: 120 })
  telefones: string;

  @Column({ name: 'celulares', length: 120 })
  celulares: string;

  @Column({ name: 'email', length: 160 })
  email: string;

  @Column({ name: 'crédito' })
  credito: number;

  @Column({ name: 'cpf' })
  cpf: number;

  @Column({ name: 'cnpj' })
  cnpj: number;

  @Column({ name: 'ie' })
  ie: number;

  @Column({ name: 'razãosocial', length: 100 })
  razaoSocial: string;

  @Column({ name: 'sexo' })
  sexo: number;

  @Column({ name: 'uid', length: 40 })
  uid: string;

  @Column({ name: 'rfid', length: 40 })
  rfid: string;

  @Column({ name: 'observações' })
  observacoes: string;

}

export default Cliente;
