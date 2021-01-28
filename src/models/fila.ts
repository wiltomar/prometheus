import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Base from './base';
import Computador from './computador';

@Entity('Integracao.Fila')
class Fila extends Base {
  @Column()
  uuid: string;

  @Column()
  situacao: number;
  
  @Column()
  tipo: number;

  @OneToOne(() => Computador, (computadorOrigem) => computadorOrigem.id)
  @JoinColumn({ name: 'computadororigemid' })
  computadorOrigem: Computador;
  
  @OneToOne(() => Computador, (computadorDestino) => computadorDestino.id)
  @JoinColumn({ name: 'computadordestinoid' })
  computadorDestino: Computador;
  
  @Column()
  tabela: number;

  @Column()
  registroId: number;
    
  @Column()
  appOrigem: number;
  
  @Column()
  appDestino: number;
  
  @Column()
  processado: number;
  
  @Column()
  processadoMomento: Date;  
}

export default Fila;
