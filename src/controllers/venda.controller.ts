import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import Lancamento from '@models/lancamento';
import { Venda } from '@models/venda';
import VendaHelper from 'src/common/funcoes';

class VendaController {
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
      let { clienteid, vendedorid } = req.query;
      let vendas: Venda[] = [];
      if (clienteid) {
        let lancamentos = await getRepository(Lancamento).find(
          {
            select: ['id'],
            where: { cliente: { id: clienteid }},
            order: { id: 'ASC' }
          },
        );
        for (const lancamento of lancamentos) {
          const venda = await VendaHelper.venda(lancamento.id, false);
          vendas.push(venda);
        }
      } else if (vendedorid) {
        let lancamentos = await getRepository(Lancamento).find(
          {
            select: ['id'],
            where: { vendedor: { id: vendedorid }},
            order: { id: 'ASC' }
          },
        );
        for (const lancamento of lancamentos) {
          const venda = await VendaHelper.venda(lancamento.id, false);
          vendas.push(venda);
        }
      }
      console.log(vendas.length);
      return res.status(200).json(vendas);      
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    const venda = await VendaHelper.venda(+req.params.id, true);
    if (!venda)
      return res.status(404).json({ message: 'Lançamento não encontrado!' });
    return res.status(200).json(venda);
  }
}

export default new  VendaController();
