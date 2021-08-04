import { getRepository, ILike } from 'typeorm';
import { Request, Response } from 'express';
import NaturezaOperacao from '../models/naturezaoperacao';

class NaturezaOperacaoController {
  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(NaturezaOperacao);
      const lista = await repositorio.find({ where: { nome: ILike('%venda%') }, order: { nome: 'ASC' } });
      return res.status(200).json(lista);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(NaturezaOperacao);
      const instancia = await repositorio.findOne(
        { where: { id: req.params.id } },
      );
      if (!instancia) {
        return res.status(404).json({ message: 'Natureza da operação não encontrada!' });
      }
      return res.status(200).json(instancia);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new NaturezaOperacaoController();
