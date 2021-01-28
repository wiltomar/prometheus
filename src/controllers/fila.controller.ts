import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import Fila from '@models/fila';

class FilaController {
  async grava(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Fila);
      const fila = repositorio.create(req.body);
      return res.status(201).json(await repositorio.save(fila));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Fila);
      let { texto } = req.query;
      if (!texto) { texto = ''; }
      const filas = await repositorio.find();
      return res.status(200).json(filas);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Fila);
      const fila = await repositorio.findOne(
        { where: { id: req.params.id }, relations: ['computadorOrigem', 'computadorDestino'] },
      );

      if (!fila) {
        return res.status(404).json({ message: 'Fila não encontrada!' });
      }
      return res.status(200).json(fila);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new FilaController();
