import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import Produto from '@models/produto';

class ProdutoController {
  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Produto);
      const produtos = await repositorio.find({ status: 0, venda: true, ativo: true });

      return res.status(200).json(produtos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorNome(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Produto);
      const { nome } = req.body;

      const produto = await repositorio.findOne({ where: { nome } });

      if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado!' });
      }

      return res.status(200).json(produto);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Produto);
      const produto = await repositorio.findOne(
        { where: { id: req.params.id, venda: true, ativo: true } },
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
