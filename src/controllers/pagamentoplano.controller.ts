import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import PagamentoPlano from '@models/pagamentoplano';

class PagamentoPlanoController {
  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(PagamentoPlano);
      const pagamentoplanos = await repositorio.find({ select: ["id", "nome"], order: { nome: "ASC" } });

      return res.status(200).json(pagamentoplanos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(PagamentoPlano);
      const pagamentoplano = await repositorio.findOne(
        { where: { id: req.params.id }, relations: ['pagamentoforma'] }
      );

      if (!pagamentoplano) {
        return res.status(404).json({ message: 'Plano de pagamento não encontrado!' });
      }

      return res.status(200).json(pagamentoplano);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new PagamentoPlanoController();
