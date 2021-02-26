import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import PagamentoForma from '../models/pagamentoforma';

class PagamentoFormaController {
  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(PagamentoForma);
      const pagamentoformas = await repositorio.find({ order: { nome: 'ASC' } });

      return res.status(200).json(pagamentoformas);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(PagamentoForma);
      const pagamentoforma = await repositorio.findOne(
        { where: { id: req.params.id } },
      );

      if (!pagamentoforma) {
        return res.status(404).json({ message: 'Forma de pagamento não encontrada!' });
      }

      return res.status(200).json(pagamentoforma);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new PagamentoFormaController();
