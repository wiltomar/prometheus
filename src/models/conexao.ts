import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Base from './base';
import Computador from './computador';
import Usuario from './usuario';

@Entity('Mosaico.Conexao')
class Conexao extends Base {

  @Column()
  aplicativo: number;

  @OneToOne(() => Usuario, (usuario) => usuario.id)
  @JoinColumn({ name: 'usuarioid' })
  usuario: Usuario;

  @OneToOne(() => Computador, (computador) => computador.id)
  @JoinColumn({ name: 'computadorid' })
  computador: Computador;

  @Column()
  inicio: Date;

  @Column()
  conclusao: Date;
  
  @Column({ length: 60 })
  soPrograma: string;

  @Column({ length: 60 })
  soProgramaVersao: string;
}

export default Conexao;