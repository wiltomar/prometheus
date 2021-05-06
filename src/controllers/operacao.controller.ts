import { getRepository, ILike } from 'typeorm';
import { Request, Response } from 'express';

import Operacao from '@models/operacao';

class OperacaoController {
  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Operacao);
      const lista = await repositorio.find({
        where: {
          modulo: 16,
          submodulo: 0
        },
        order: { nome: 'ASC' }
      });
      return res.status(200).json(lista);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Operacao);
      const instancia = await repositorio.findOne(
        { where: { id: req.params.id } },
      );
      if (!instancia) {
        return res.status(404).json({ message: 'Operação não encontrada!' });
      }
      return res.status(200).json(instancia);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new OperacaoController();