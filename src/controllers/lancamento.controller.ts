import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import Lancamento from '@models/lancamento';

class LancamentoController {
  async grava(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Lancamento);
      const lancamento = repositorio.create(req.body);
      return res.status(201).json(await repositorio.save(lancamento));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Lancamento);
      let { clienteid } = req.query;
      if (!clienteid) { clienteid = '-1'; }
      const lancamentos = await repositorio.find(
        {
          order: { id: 'ASC' },
          relations: ['conexao', 'estabelecimento', 'historico', 'cliente'],
        },
      );
      return res.status(200).json(lancamentos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Lancamento);
      const lancamento = await repositorio.findOne(
        { where: { id: req.params.id }, relations: ['conexao', 'estabelecimento', 'historico', 'cliente', 'pedidos', 'pedidos.pedidoProdutos', 'contas'] },
      );

      if (!lancamento) {
        return res.status(404).json({ message: 'Lançamento não encontrado!' });
      }
      return res.status(200).json(lancamento);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new LancamentoController();
