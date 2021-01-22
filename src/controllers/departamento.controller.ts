import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import Departamento from '@models/departamento';

class DepartamentoController {
  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Departamento);
      const departamentos = await repositorio.find({ order: { nome: "ASC" }, where: { ativo: true, venda: true } });

      return res.status(200).json(departamentos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorNome(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Departamento);
      const { nome } = req.body;

      const departamento = await repositorio.findOne({ where: { nome } });

      if (!departamento) {
        return res.status(404).json({ message: 'Departamento não encontrado!' });
      }

      return res.status(200).json(departamento);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Departamento);
      const departamento = await repositorio.findOne(
        { where: { id: req.params.id } },
      );

      if (!departamento) {
        return res.status(404).json({ message: 'Departamento não encontrado!' });
      }

      return res.status(200).json(departamento);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new DepartamentoController();
