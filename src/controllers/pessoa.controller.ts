import { getRepository, Like, Raw } from 'typeorm';
import { Request, Response } from 'express';
import Pessoa from '@models/pessoa';

class PessoaController {
  async grava(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Pessoa);
      const pessoa = repositorio.create(req.body);
      return res.status(201).json(await repositorio.save(pessoa));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async lista(req: Request, res: Response) {
    // http://localhost:3000/api/v1/pessoas?texto=wiltomar
    try {
      const repositorio = getRepository(Pessoa);
      let { texto } = req.query;
      if (!texto) { texto = ''; }
      const pessoas = await repositorio.find(
        {
          select: ['id', 'nome'], 
          where: { nome: Like(`%${texto}%`), status: Raw(alias => `(${alias} & 1) = 0`) }, 
          order: { nome: 'ASC' } 
        });
      return res.status(200).json(pessoas);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Pessoa);
      const pessoa = await repositorio.findOne(
        {
          where: { id: req.params.id, status: Raw(alias => `(${alias} & 1) = 0`) },
          relations: ['estabelecimento'] 
        }
      );
      if (!pessoa) {
        return res.status(404).json({ message: 'Pessoa não encontrada!' });
      }
      return res.status(200).json(pessoa);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new PessoaController();
