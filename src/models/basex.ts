import {
  Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert,
  BeforeUpdate, BaseEntity,
} from 'typeorm';

abstract class Basex extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'código'})
  id: number;

  @CreateDateColumn({ name: 'datadainclusão'})
  inclusao: Date;

  @UpdateDateColumn({ name: 'datadeedição'})
  edicao: Date;

  @Column({ nullable: false})
  status: number;

  @BeforeInsert()
  setCreateDate(): void {
    this.inclusao = new Date();
    this.edicao = this.inclusao;
  }

  @BeforeUpdate()
  setUpdateDate(): void {
    this.edicao = new Date();
  }
}

export default Basex;
