import { getManager, getRepository } from 'typeorm';
import { Request, Response } from 'express';
import Lancamento from '@models/lancamento';
import Pedido from '@models/pedido';
import Conta from '@models/conta';

class LancamentoController {
  async grava(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Lancamento);
      const lancamento = repositorio.create(req.body);      
      const retorno = await repositorio.save(lancamento);
      // Atualiza os campos lançamento e tipo da tabela pedidos_produtos
      // Wiltomar
      let s: string[] = [];
      s.push('UPDATE R SET');
      s.push('  R.Lancamento = P.Lançamento,');
      s.push('  R.Tipo = P.Tipo');
      s.push('FROM');
      s.push('  Pedidos P');
      s.push('  JOIN Pedidos_Produtos R ON R.Pedido = P.Código');
      s.push('WHERE P.Lançamento = ' + retorno['id'] + ';');
      getManager().query(s.join('\n')); // promise
      // Retorna
      return res.status(201).json(retorno);      
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Lancamento);
      let { clienteid } = req.query;
      if (!clienteid) { clienteid = '-1'; }
      const lancamentos = await repositorio.find(
        {
          order: { id: 'ASC' },
          relations: ['conexao', 'estabelecimento', 'historico', 'cliente']
        },
      );
      return res.status(200).json(lancamentos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Lancamento);
      let lancamentox = await repositorio.findOne(
        {
          where: { id: req.params.id },
          relations: ['conexao', 'estabelecimento', 'historico', 'cliente']
        }
      );
      if (!lancamentox) {
        return res.status(404).json({ message: 'Lançamento não encontrado!' });
      }
      // Pedidos
      const pedidoRepositorio = getRepository(Pedido);
      lancamentox.pedidos = await pedidoRepositorio.find(
        {
          where: { lancamento: { id: lancamentox.id } },
          relations: [
            'conexao', 'estabelecimento', 'vendedor', 'pedidoProdutos', 'pedidoProdutos.produto',
            'pedidoProdutos.estabelecimento', 'pedidoProdutos.departamento'
          ]
        },
      );      
      // Contas
      const contaRepositorio = getRepository(Conta);
      lancamentox.contas = await contaRepositorio.find(
        {
          where: { lancamento: { id: lancamentox.id } },
          relations: ['conexao', 'pagamentoforma', 'contacorrente']
        },
      );
      return res.status(200).json(lancamentox);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new LancamentoController();
