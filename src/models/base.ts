import {
  Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert,
  BeforeUpdate, BaseEntity,
} from 'typeorm';

class Base extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn()
  inclusao: Date;

  @UpdateDateColumn()
  edicao: Date;

  @Column()
  status: number;

  @BeforeInsert()
  setCreateDate(): void {
    this.inclusao = new Date();
    this.edicao = this.inclusao;
    this.status = 0;
  }

  @BeforeUpdate()
  setUpdateDate(): void {
    this.edicao = new Date();
  }
}

export default Base;
