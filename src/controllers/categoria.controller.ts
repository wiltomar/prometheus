import { getRepository, Raw } from 'typeorm';
import { Request, Response } from 'express';

import Categoria from '@models/categoria';

class CategoriaController {
  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Categoria);
      const categorias = await repositorio.find({
        select: ['id', 'nome'], 
        where: { venda: true, status: Raw(alias => `(${alias} & 1) = 0`) }, 
        order: { nome: 'ASC' }
      });
      return res.status(200).json(categorias);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Categoria);
      const categoria = await repositorio.findOne(
        { where: { id: req.params.id, venda: true } },
      );

      if (!categoria) {
        return res.status(404).json({ message: 'Categoria não encontrada!' });
      }

      return res.status(200).json(categoria);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new CategoriaController();
