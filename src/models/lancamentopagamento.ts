import { Entity, Column, OneToOne, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import Lancamento from './lancamento';
import Conexao from './conexao';
import { PagamentoPlanoR } from './pagamentoplano';
import { PagamentoFormaR } from './pagamentoforma';

@Entity('lançamentos_formasdepagamento')
class LancamentoPagamento {
  @PrimaryGeneratedColumn('increment', { name: 'lancamentoformadepagamentoid'})
  id: number;

  @CreateDateColumn({ name: 'inclusao'})
  inclusao: Date;

  @CreateDateColumn({ name: 'edicao'})
  edicao: Date;

  @Column({ name: 'status' })
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

  @ManyToOne(() => Lancamento, (lancamento) => lancamento.id)
  @JoinColumn({ name: 'lancamentoid', referencedColumnName: 'id' })
  lancamento: Lancamento;

  @OneToOne(() => Conexao, (conexao) => conexao.id)
  @JoinColumn({ name: 'conexaoid' })
  conexao: Conexao;  

  @Column({ name: 'sp' })
  sp: number;

  @OneToOne(() => PagamentoPlanoR, (pagamentoPlano) => pagamentoPlano.id)
  @JoinColumn({ name: 'planodepagamentoid' })
  pagamentoPlano: PagamentoPlanoR;

  @OneToOne(() => PagamentoFormaR, (pagamentoForma) => pagamentoForma.id)
  @JoinColumn({ name: 'formadepagamentoid' })
  pagamentoForma: PagamentoFormaR;

  @Column({ name: 'parcelas' })
  parcelas: number;

  @Column({ name: 'valor', type: 'money'  })
  valor: number;
}

export default LancamentoPagamento;
