import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import Estabelecimento from '@models/Estabelecimento';

class EstabelecimentoController {
  async list(req: Request, res: Response) {
    const repository = getRepository(Estabelecimento);
    const list = await repository.find({ ativo: true });

    return res.json(list);
  }

  async findbyNome(req: Request, res: Response) {
    const repository = getRepository(Estabelecimento);
    const { nome } = req.body;

    const instance = await repository.findOne({ where: { nome } });

    if (!instance) {
      return res.json({ message: 'Estabelecimento not found!' });
    }

    return res.json(instance);
  }

  async findById(req: Request, res: Response) {
    const repository = getRepository(Estabelecimento);
    const instance = await repository.findOne(
      { where: { id: req.params.id } },
    );

    if (!instance) {
      return res.json({ message: 'Estabelecimento not found!' });
    }

    return res.json(instance);
  }
}

export default new EstabelecimentoController();
