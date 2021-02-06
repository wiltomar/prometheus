import { getRepository, Like, Raw } from 'typeorm';
import { Request, Response } from 'express';

import Produto from '@models/produto';
import Computador, { COMPUTADOR_PROMETHEUS } from '@models/computador';

class ProdutoController {
  async lista(req: Request, res: Response) {
    // http://localhost:3000/api/v1/produtos?texto=refri
    try {
      const computador = await getRepository(Computador).findOne({
        where: { nome: COMPUTADOR_PROMETHEUS },
        relations: ['estabelecimento']
      });
      if (!computador)
        throw new Error(`não existe um perfil de computador com o nome ${COMPUTADOR_PROMETHEUS}`);
      const repositorio = getRepository(Produto);
      let { texto } = req.query;
      if (!texto) { texto = ''; }
      const produtos = await repositorio.find(
        {
          select: ['id', 'nome'], 
          where: { nome: Like(`%${texto}%`), status: Raw(alias => `(${alias} & 1) = 0`), venda: true, ativo: true, id: Raw(alias => `(${alias} IN (SELECT ProdutoID FROM Mosaico.ProdutoEstabelecimento WHERE (EstabelecimentoID = ${computador.estabelecimento.id}) AND (Ativo = 1)))`) },
          order: { nome: 'ASC' }
        }
      );
      return res.status(200).json(produtos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Produto);
      const produto = await repositorio.findOne(
        {
          where: { id: req.params.id, status: Raw(alias => `(${alias} & 1) = 0`), venda: true, ativo: true },
          relations: ['categoria']
        },
      );

      if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado!' });
      }

      return res.status(200).json(produto);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new ProdutoController();
