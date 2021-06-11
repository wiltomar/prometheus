import { ModalidadeR } from './modalidade';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import Base from './base';
import { EstabelecimentoR } from './estabelecimento';

@Entity('Mosaico.Atendimento')
class Atendimento extends Base {

  @OneToOne(() => EstabelecimentoR, (estabelecimento) => estabelecimento.id)
  @JoinColumn({ name: 'estabelecimentoid' })
  estabelecimento: EstabelecimentoR;

  @Column()
  atendimento: number;

  @OneToOne(() => ModalidadeR, (modalidade) => modalidade.id)
  @JoinColumn({ name: 'modalidadeid' })
  modalidade: ModalidadeR;

  @Column()
  ambienteid: number;

  @Column()
  ativo: boolean;

}

export default Atendimento;
