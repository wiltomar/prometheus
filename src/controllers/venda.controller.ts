import { getManager, getRepository, Not, Raw } from 'typeorm';
import { Request, Response } from 'express';
import Lancamento from '@models/lancamento';
import { Venda } from '@models/venda';
import VendaHelper from '../common/funcoes';
import Computador, { COMPUTADOR_PROMETHEUS } from '@models/computador';
import Historico from '@models/historico';
import Conexao from '@models/conexao';
import LancamentoPagamento from '@models/lancamentopagamento';
import Pedido from '@models/pedido';
import PedidoProduto from '@models/pedidoproduto';
import Conta from '@models/conta';

class VendaController {
  async grava(req: Request, res: Response) {
    try {
      const computador = await getRepository(Computador).findOne({
        where: { nome: COMPUTADOR_PROMETHEUS },
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
      // lançamento
      let lancamento: Lancamento;
      if (!venda.id) { // Novo
        lancamento = new Lancamento();
        lancamento.conexao = conexao;
        lancamento.tipo = 16;
        lancamento.atendimento = null;
        lancamento.estabelecimento = computador.estabelecimento;
        lancamento.historico = historico;
        lancamento.emissao = null;
      } else { // Edição
        lancamento = await getRepository(Lancamento).findOne(
          {
            where: { id: venda.id, status: Raw(alias => `(${alias} & 1) = 0`) },
            relations: ['conexao', 'estabelecimento', 'historico', 'cliente']
          }
        );
        if (!lancamento)
          throw new Error('lançamento inválido');
      }
      lancamento.cliente = venda.cliente;
      lancamento.memorando = venda.memorando;
      lancamento.subtotal = venda.subtotal;
      lancamento.desconto = venda.desconto;
      lancamento.descontoPercentual = 0;
      lancamento.bonificacao = 0;
      lancamento.taxaServico = 0;
      lancamento.taxaEntrega = venda.taxaEntrega;
      lancamento.total = venda.total;
      // Pedido
      let pedido: Pedido;
      let item = 0;
      if (!venda.id) {
        pedido = new Pedido();
        pedido.estabelecimento = lancamento.estabelecimento;
        pedido.tipo = lancamento.tipo;
        pedido.natureza = -1;
        pedido.requisicao = new Date();
        pedido.entrega = null;
        pedido.emissao = null;
        pedido.complemento = null;
        pedido.conexao = conexao;
        pedido.pedidoProdutos = [];
        lancamento.pedidos = [pedido];
      } else {
        lancamento.pedidos = await getRepository(Pedido).find({
          where: { lancamento: { id: venda.id }, status: Raw(alias => `(${alias} & 1) = 0`) },
          relations: ['conexao', 'estabelecimento', 'vendedor' ]
        });
        if (!lancamento.pedidos || (lancamento.pedidos.length === 0))
          throw new Error('lançamento inválido');
        pedido = lancamento.pedidos[0];
        pedido.pedidoProdutos = await getRepository(PedidoProduto).find({
          where: { pedido: { id: pedido.id } },
          relations: [ 'estabelecimento', 'departamento', 'produto' ]
        });        
        item = Math.max.apply(Math, pedido.pedidoProdutos.map(i => i.item));
        if (!item)
          item = 0;
      }
      pedido.vendedor = venda.vendedor;
      pedido.vendedorComissao = 0;
      pedido.vendedorComissaoValor = 0;
      // Pedidos: Produtos
      for (const vendaItem of venda.itens) {
        let pedidoProduto: PedidoProduto = null;
        if (vendaItem.id)
          pedidoProduto = pedido.pedidoProdutos.find(i => i.id === vendaItem.id);
        if (!pedidoProduto) { // Novo
          pedidoProduto = new PedidoProduto();          
          pedidoProduto.item = ++item;
          pedidoProduto.subitem = 0;
          pedidoProduto.itemTitular = 0;
          pedidoProduto.tipo = lancamento.tipo;
          pedidoProduto.atendimento = lancamento.atendimento;
          pedidoProduto.natureza = -1;          
          pedidoProduto.estabelecimento = lancamento.estabelecimento;
          pedidoProduto.departamento = computador.departamento;
        }
        pedidoProduto.produto = vendaItem.produto;
        pedidoProduto.preco = vendaItem.preco;
        pedidoProduto.qde = vendaItem.qde;
        pedidoProduto.fator = 1;
        pedidoProduto.desconto = vendaItem.desconto;
        pedidoProduto.precoTotal = vendaItem.precoTotal;
        pedidoProduto.comissionado = true;
        pedidoProduto.observacoes = vendaItem.observacoes;
        if (!pedidoProduto.id)
          pedido.pedidoProdutos.push(pedidoProduto);
      }      
      // Pagamentos
      let sp = 0;
      if (!venda.id) {
        lancamento.pagamentos = [];
      } else {
        lancamento.pagamentos = await getRepository(LancamentoPagamento).find({
          where: { lancamento: { id: venda.id }, status: Raw(alias => `(${alias} & 1) = 0`) },
          relations: ['conexao', 'pagamentoPlano', 'pagamentoForma' ]
        });
        if (!lancamento.pagamentos)
          lancamento.pagamentos = [];
        sp = Math.max.apply(Math, lancamento.pagamentos.map(i => i.sp));
        if (!sp)
          sp = 0;
      }
      for (const pagamento of venda.pagamentos) {
        let lancamentoPagamento: LancamentoPagamento = null;
        if (pagamento.id)
          lancamentoPagamento = lancamento.pagamentos.find(i => i.id === pagamento.id);
        if (!lancamentoPagamento) {
          lancamentoPagamento = new LancamentoPagamento();
          lancamentoPagamento.conexao = conexao;
          lancamentoPagamento.sp = ++sp;  
        }
        lancamentoPagamento.pagamentoPlano = pagamento.pagamentoPlano;
        lancamentoPagamento.pagamentoForma = pagamento.pagamentoForma;
        lancamentoPagamento.parcelas = pagamento.parcelas;
        lancamentoPagamento.valor = pagamento.valor;
        if (!lancamentoPagamento.id)
          lancamento.pagamentos.push(lancamentoPagamento);
      }
      //return res.status(201).json(lancamento);
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

  async exclui(req: Request, res: Response) {
    try {
      let lancamento = await getRepository(Lancamento).findOne({
        where: { id: +req.params.id }
      });
      if (!lancamento)
        throw new Error('lançamento inválido');
      if ((lancamento.status & 1) > 0)
        throw new Error('lançamento já excluído');
      if (lancamento.emissao)
        throw new Error('lançamento já encerrado');
      let contas = await getRepository(Conta).count( { where: { lancamento: { id: +req.params.id }, natureza: Not(0) } } );
      if (contas)
        throw new Error('lançamento com contas');
      let s: string[] = [];
      s.push('DECLARE @LancamentoID BIGINT = ' +req.params.id + ';');
      s.push('UPDATE Mosaico.Lancamento SET');
      s.push('	Edicao = GETDATE(),');
      s.push('	[Status] = [Status] | 1,');
      s.push('	Emissao = GETDATE()');
      s.push('WHERE');
      s.push('	(ID = @LancamentoID)');
      s.push('	AND (Emissao IS NULL);');
      s.push('UPDATE Mosaico.Pedido SET');
      s.push('	Edicao = GETDATE(),');
      s.push('	[Status] = [Status] | 1,');
      s.push('	Natureza = 0	');
      s.push('WHERE LancamentoID = @LancamentoID;');
      s.push('UPDATE Mosaico.PedidoProduto SET');
      s.push('	Edicao = GETDATE(),');
      s.push('	[Status] = [Status] | 1,');
      s.push('	Natureza = 0,	');
      s.push('	Fator = 0');
      s.push('WHERE LancamentoID = @LancamentoID;');
      s.push('UPDATE Mosaico.LancamentoPagamento SET');
      s.push('	Edicao = GETDATE(),');
      s.push('	[Status] = [Status] | 1');
      s.push('WHERE');
      s.push('	(LancamentoID = @LancamentoID)');
      s.push('	AND (SP < 200);');
      console.log(s.join('\n'));
      await getManager().query(s.join('\n')); // promise
      res.status(200).send({ message: 'registro excluído' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new  VendaController();
