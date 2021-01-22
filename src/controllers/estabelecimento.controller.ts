import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import Estabelecimento from '@models/estabelecimento';

class EstabelecimentoController {
  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Estabelecimento);
      const estabelecimentos = await repositorio.find({ ativo: true });

      return res.status(200).json(estabelecimentos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorNome(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Estabelecimento);
      const { nome } = req.body;

      const estabelecimento = await repositorio.findOne({ where: { nome } });

      if (!estabelecimento) {
        return res.status(404).json({ message: 'Estabelecimento não encontrado!' });
      }

      return res.status(200).json(estabelecimento);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Estabelecimento);
      const estabelecimento = await repositorio.findOne(
        { where: { id: req.params.id } },
      );

      if (!estabelecimento) {
        return res.status(404).json({ message: 'Estabelecimento não encontrado!' });
      }

      return res.status(200).json(estabelecimento);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new EstabelecimentoController();
