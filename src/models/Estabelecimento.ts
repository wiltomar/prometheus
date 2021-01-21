import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Mosaico.Estabelecimento')
class Estabelecimento {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nome: string;

  @Column()
  ativo: boolean;

  @CreateDateColumn()
  inclusao: Date;

  @UpdateDateColumn()
  edicao: Date;

  @Column()
  status: number;

}

export default Estabelecimento;
