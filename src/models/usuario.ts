import {
  Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import Base from './base';

@Entity('Mosaico.Usuario')
class Usuario extends Base {
  @Column()
  nome: string;

  @Column()
  status: number;

  @Column()
  ativo: number;

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
