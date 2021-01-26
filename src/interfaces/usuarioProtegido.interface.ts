/* eslint-disable no-unused-vars */
interface UsuarioProtegido {
  id: number;
  nome: string;
  inclusao: Date;
  edicao: Date;
  status: number;
  ativo: number;
  usuario: boolean;
  vendedor: boolean;
  comissao: number;
  estabelecimentoID: number;
  senha?: string;
  senhaHash?: string;
}