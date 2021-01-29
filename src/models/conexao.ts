import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Basex from './basex';
import Computador from './computador';
import Usuario from './usuario';

@Entity('conexões')
class Conexao extends Basex {
  @Column({ name: 'aplicativo' })
  aplicativo: number;

  @OneToOne(() => Usuario, (usuario) => usuario.id)
  @JoinColumn({ name: 'usuário' })
  usuario: Usuario;

  @OneToOne(() => Computador, (computador) => computador.id)
  @JoinColumn({ name: 'computador' })
  computador: Computador;

  @Column({ name: 'datadaentrada' })
  inicio: Date;

  @Column({ name: 'datadasaída' })
  conclusao: Date;
  
  @Column({ name: 's_programa', length: 60 })
  soPrograma: string;

  @Column({ name: 's_programaversao', length: 60 })
  soProgramaVersao: string;
}

export default Conexao;