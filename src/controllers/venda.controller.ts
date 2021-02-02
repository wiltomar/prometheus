import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import Lancamento from '@models/lancamento';
import { Venda } from '@models/venda';

class VendaController {
  async buscaPorId(req: Request, res: Response) {
    try {
      const venda = await this.vendaFromId(+req.params.id);
      if (!venda)
        return res.status(404).json({ message: 'Lançamento não encontrado!' });
      return res.status(200).json(venda);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    } 
  }

  async grava(req: Request, res: Response) {
    try {
      /*const repositorio = getRepository(Lancamento);
      const lancamento = repositorio.create(req.body);      
      const retorno = await repositorio.save(lancamento);*/
      let venda = new Venda();
      return res.status(201).json(venda);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async lista(req: Request, res: Response) {
    try {
      /*const repositorio = getRepository(Lancamento);
      let { clienteid } = req.query;
      if (!clienteid) { clienteid = '-1'; }'
      const lancamentos = await repositorio.find(
        {
          order: { id: 'ASC' },
          relations: ['conexao', 'estabelecimento', 'historico', 'cliente']
        },
      );*/
      let vendas: Venda[] = [];
      return res.status(200).json(vendas);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Wiltomar
  async buscaPorId(req: Request, res: Response) {
    //+req.params.id
    const venda = await vendaFromId(0);
    if (!venda)
      return res.status(404).json({ message: 'Lançamento não encontrado!' });
    return res.status(200).json(venda);
  }

  async vendaFromId(id: number): Promise<Venda> {
    const repositorio = getRepository(Lancamento);
    let lancamento = await repositorio.findOne(
      {
        where: { id: id },
        relations: ['conexao', 'estabelecimento', 'historico', 'cliente']
      }
    );
    if (!lancamento) {
      return null;
    }
    // Melhorar essa cópia de propriedades posteriormente
    //let retorno: Venda = JSON.parse(JSON.stringify(lancamento));
    let retorno: Venda = new Venda();
    return retorno;
  }
}

export default new  VendaController();
