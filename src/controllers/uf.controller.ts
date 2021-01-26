import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import UF from '@models/uf';

class UFController {
  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(UF);
      const ufs = await repositorio.find({ order: { nome: 'ASC' } });

      return res.status(200).json(ufs);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorNome(req: Request, res: Response) {
    try {
      const repositorio = getRepository(UF);
      const { nome } = req.body;

      const uf = await repositorio.findOne({ where: { nome } });

      if (!uf) {
        return res.status(404).json({ message: 'UF não encontrada!' });
      }

      return res.status(200).json(uf);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(UF);
      const uf = await repositorio.findOne(
        { where: { id: req.params.id } },
      );

      if (!uf) {
        return res.status(404).json({ message: 'UF não encontrada!' });
      }

      return res.status(200).json(uf);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new UFController();
