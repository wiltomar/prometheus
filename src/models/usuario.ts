import {
  Entity, Column, BeforeInsert, BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import Base from './base';

@Entity('Mosaico.Usuario')
class Usuario extends Base {
  @Column()
  nome: string;

  @Column()
  ativo: number;

  @Column()
  usuario: boolean;

  @Column()
  vendedor: boolean;

  @Column('numeric')
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
