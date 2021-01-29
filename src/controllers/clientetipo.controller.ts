import { getRepository, Like, Raw } from 'typeorm';
import { Request, Response } from 'express';

import ClienteTipo from '@models/clientetipo';

class ClienteTipoController {
  async lista(req: Request, res: Response) {
    // http://localhost:3000/api/v1/clientetipos?texto=vip
    try {
      const repositorio = getRepository(ClienteTipo);
      let { texto } = req.query;
      if (!texto) { texto = ''; }
      const clientetipos = await repositorio.find(
        {
          select: ['id', 'nome'], 
          where: { nome: Like(`%${texto}%`), status: Raw(alias => `(${alias} & 1) = 0`) },
          order: { nome: 'ASC' }
        }
      );
      return res.status(200).json(clientetipos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorNome(req: Request, res: Response) {
    try {
      const repositorio = getRepository(ClienteTipo);
      const { nome } = req.body;

      const clientetipo = await repositorio.findOne({ where: { nome } });

      if (!clientetipo) {
        return res.status(404).json({ message: 'Tipo de cliente não encontrado!' });
      }

      return res.status(200).json(clientetipo);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(ClienteTipo);
      const clientetipo = await repositorio.findOne(
        { where: { id: req.params.id } },
      );

      if (!clientetipo) {
        return res.status(404).json({ message: 'Tipo de cliente não encontrado!' });
      }

      return res.status(200).json(clientetipo);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new ClienteTipoController();
