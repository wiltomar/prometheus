import { getRepository, Like } from 'typeorm';
import { Request, Response } from 'express';

import Cliente from '@models/cliente';

class ClienteController {
  async grava(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Cliente);
      const cliente = repositorio.create(req.body);
      return res.status(201).json(await repositorio.save(cliente));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


  async lista(req: Request, res: Response) {
    // http://localhost:3000/api/v1/clientes?texto=wiltomar
    try {
      const repositorio = getRepository(Cliente);
      let texto = req.query.texto;
      if (!texto)
        texto = '';
      const clientes = await repositorio.find({ select: ["id", "nome"], where: { nome: Like(`%${texto}%`) }, order: { nome: "ASC" } });

      return res.status(200).json(clientes);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Cliente);
      const cliente = await repositorio.findOne(
        { where: { id: req.params.id }, relations: ['estabelecimento', 'clientetipo', 'preco', 'municipio'] },
      );

      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado!' });
      }

      return res.status(200).json(cliente);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new ClienteController();
