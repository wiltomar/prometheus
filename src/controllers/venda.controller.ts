import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import Lancamento from '@models/lancamento';
import { Venda } from '@models/venda';
import VendaHelper from 'src/common/funcoes';
import Computador from '@models/computador';
import Historico from '@models/historico';
import Conexao from '@models/conexao';
import LancamentoPagamento from '@models/lancamentopagamento';
import Pedido from '@models/pedido';
import PedidoProduto from '@models/pedidoproduto';

class VendaController {
  async grava(req: Request, res: Response) {
    try {
      /*const repositorio = getRepository(Lancamento);
      const lancamento = repositorio.create(req.body);      
      const retorno = await repositorio.save(lancamento);*/
      const computador = await getRepository(Computador).findOne({
        where: { nome: 'PROMETHEUS' },
        relations: ['estabelecimento', 'departamento']
      });
      if (!computador)
        throw new Error('não existe um perfil de computador com o nome "PROMETHEUS"');
      const historico = await getRepository(Historico).findOne( {
        where: { tipo: 16 }
      });
      if (!historico)
        throw new Error('não existe um histórico do tipo venda');
      const conexao = await getRepository(Conexao).findOne({
        where: { id: 0 }        
      });
      if (!conexao)
        throw new Error('não existe uma conexão com o código 0');
      let venda = Object.assign(new Venda(), req.body);
      // Lançamento
      let lancamento = new Lancamento();
      lancamento.conexao = conexao;
      lancamento.tipo = 16;
      lancamento.atendimento = null;
      lancamento.estabelecimento = computador.estabelecimento;
      lancamento.historico = historico;
      lancamento.cliente = venda.cliente;
      lancamento.memorando = venda.memorando;
      lancamento.emissao = null;
      lancamento.subtotal = venda.subtotal;
      lancamento.desconto = venda.desconto;
      lancamento.descontoPercentual = 0;
      lancamento.bonificacao = 0;
      lancamento.taxaServico = 0;
      lancamento.taxaEntrega = venda.taxaEntrega;
      lancamento.total = venda.total;
      // Pedidos
      let pedido = new Pedido();
      pedido.estabelecimento = lancamento.estabelecimento;
      pedido.tipo = lancamento.tipo;
      pedido.natureza = -1;
      pedido.requisicao = new Date();
      pedido.entrega = null;
      pedido.emissao = null;
      pedido.complemento = null;
      pedido.conexao = conexao;
      pedido.vendedor = venda.vendedor;
      pedido.vendedorComissao = 0;
      pedido.vendedorComissaoValor = 0;      
      // Pedidos: Produtos
      pedido.pedidoProdutos = [];
      let item = 0;
      for (const vendaItem of venda.itens) {
        let pedidoProduto = new PedidoProduto();
        pedidoProduto.item = ++item;
        pedidoProduto.subitem = 0;
        pedidoProduto.itemTitular = 0;
        pedidoProduto.tipo = lancamento.tipo;
        pedidoProduto.atendimento = lancamento.atendimento;
        pedidoProduto.natureza = -1;
        pedidoProduto.estabelecimento = lancamento.estabelecimento;
        pedidoProduto.departamento = computador.departamento;
        pedidoProduto.produto = vendaItem.produto;
        pedidoProduto.preco = vendaItem.preco;
        pedidoProduto.qde = vendaItem.qde;
        pedidoProduto.fator = 1;
        pedidoProduto.desconto = vendaItem.desconto;
        pedidoProduto.precoTotal = vendaItem.precoTotal;
        pedidoProduto.comissionado = true;
        pedidoProduto.observacoes = vendaItem.observacoes;
        pedido.pedidoProdutos.push(pedidoProduto);
      }
      lancamento.pedidos = [pedido];
      // Pagamentos
      lancamento.pagamentos = [];
      let sp = 0;
      for (const pagamento of venda.pagamentos) {
        let lancamentoPagamento = new LancamentoPagamento();
        lancamentoPagamento.conexao = conexao;
        lancamentoPagamento.sp = ++sp;
        lancamentoPagamento.pagamentoPlano = pagamento.pagamentoPlano;
        lancamentoPagamento.pagamentoForma = pagamento.pagamentoForma;
        lancamentoPagamento.parcelas = pagamento.parcelas;
        lancamentoPagamento.valor = pagamento.valor;
        lancamento.pagamentos.push(lancamentoPagamento);
      }
      const retorno = await getRepository(Lancamento).save(lancamento);
      const retornox = await VendaHelper.venda(retorno.id, true);
      return res.status(201).json(retornox);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async lista(req: Request, res: Response) {
    try {
      let { clienteid, vendedorid } = req.query;
      let vendas: Venda[] = [];
      if (clienteid) {
        let lancamentos = await getRepository(Lancamento).find({
          select: ['id'],
          where: { cliente: { id: clienteid }},
          order: { id: 'ASC' }
        });
        for (const lancamento of lancamentos) {
          const venda = await VendaHelper.venda(lancamento.id, false);
          vendas.push(venda);
        }
      } else if (vendedorid) {
        let lancamentos = await getRepository(Lancamento).find({
          select: ['id'],
          where: { vendedor: { id: vendedorid }},
          order: { id: 'ASC' }
        });
        for (const lancamento of lancamentos) {
          const venda = await VendaHelper.venda(lancamento.id, false);
          vendas.push(venda);
        }
      }
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
