/* eslint-disable no-unused-vars */
export class UsuarioProtegido {

  id: number;
  nome: string;
  inclusao: Date;
  edicao: Date;
  status: number;
  ativo: boolean;
  usuario: boolean;
  vendedor: boolean;
  comissao: number;
  estabelecimentoID: number;
  senha?: string;
  senhaHash?: string;
  
}
