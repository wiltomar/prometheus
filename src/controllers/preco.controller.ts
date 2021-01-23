import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import Preco from '@models/preco';

class PrecoController {
  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Preco);
      const precos = await repositorio.find({ order: { nome: 'ASC' } });

      return res.status(200).json(precos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorNome(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Preco);
      const { nome } = req.body;

      const preco = await repositorio.findOne({ where: { nome } });

      if (!preco) {
        return res.status(404).json({ message: 'Preço não encontrado!' });
      }

      return res.status(200).json(preco);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Preco);
      const preco = await repositorio.findOne(
        { where: { id: req.params.id } },
      );

      if (!preco) {
        return res.status(404).json({ message: 'Preço não encontrado!' });
      }

      return res.status(200).json(preco);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new PrecoController();
