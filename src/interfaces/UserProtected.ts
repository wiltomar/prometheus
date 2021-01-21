/* eslint-disable no-unused-vars */
interface UserProtected {
  UsuarioID: number;
  UsuarioNome: string;
  UsuarioApelido: string;
  Inclusao: Date;
  Edicao: Date;
  Status: number;
  Ativo: number;
  Usuario: boolean;
  Vendedor: boolean;
  Comissao: number;
  UnidadeID: number;
  Senha?: string;
  SenhaHash?: string;
}
