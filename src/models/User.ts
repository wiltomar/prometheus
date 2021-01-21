import {
  Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import bcrypt from 'bcryptjs';

@Entity('vwUsuarios')
class User {
  @PrimaryGeneratedColumn('increment')
  UsuarioID: number;

  @Column()
  UsuarioNome: string;

  @Column()
  UsuarioApelido: string;

  @CreateDateColumn()
  Inclusao: Date;

  @UpdateDateColumn()
  Edicao: Date;

  @Column()
  Status: number;

  @Column()
  Ativo: number;

  @Column()
  Usuario: boolean;

  @Column()
  Vendedor: boolean;

  @Column()
  Comissao: number;

  @Column()
  UnidadeID: number;

  @Column()
  Senha: string;

  @Column()
  SenhaHash: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    const hash = this.Senha;
    this.SenhaHash = bcrypt.hashSync(hash, 8);
  }
}

export default User;
