import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import Historico from '@models/historico';

class HistoricoController {
  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Historico);
      const historicos = await repositorio.find({ order: { nivel: 'ASC' } });

      return res.status(200).json(historicos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Historico);
      const historico = await repositorio.findOne(
        { where: { id: req.params.id } },
      );

      if (!historico) {
        return res.status(404).json({ message: 'Preço não encontrado!' });
      }

      return res.status(200).json(historico);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new HistoricoController();
