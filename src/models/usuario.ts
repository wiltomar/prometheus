import {
  Entity, Column, BeforeInsert, BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import Base from './base';

@Entity('Mosaico.Usuario')
class Usuario extends Base {

  @Column()
  inclusao: Date;

  @Column()
  edicao: Date;

  @Column()
  status: number;

  @Column()
  nome: string;

  @Column()
  ativo: boolean;

  @Column()
  usuario: boolean;

  @Column()
  vendedor: boolean;

  @Column()
  comissao: number;

  @Column()
  estabelecimentoID: number;

  @Column()
  senha: string;

  @Column()
  senhaHash: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    const hash = this.senha;
    this.senhaHash = bcrypt.hashSync(hash, 8);
  }

}

export default Usuario;
