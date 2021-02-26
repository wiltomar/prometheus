import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import Municipio from '../models/municipio';

class MunicipioController {
  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Municipio);
      const municipios = await repositorio.find({ where: { uf: { id: req.params.ufid } }, order: { nome: 'ASC' } });

      return res.status(200).json(municipios);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorNome(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Municipio);
      const { nome } = req.body;

      const municipio = await repositorio.findOne({ where: { nome } });

      if (!municipio) {
        return res.status(404).json({ message: 'Municipio não encontrado!' });
      }

      return res.status(200).json(municipio);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Municipio);
      const municipio = await repositorio.findOne(
        { where: { id: req.params.id } },
      );

      if (!municipio) {
        return res.status(404).json({ message: 'Municipio não encontrado!' });
      }

      return res.status(200).json(municipio);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new MunicipioController();
