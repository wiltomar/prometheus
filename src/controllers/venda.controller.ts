import Produto from './../models/produto';
import { getManager, getRepository, Not, Raw } from 'typeorm';
import { Request, Response } from 'express';
import Lancamento from '../models/lancamento';
import { Venda } from '../models/venda';
import VendaHelper from '../common/funcoes';
import Computador, { COMPUTADOR_PROMETHEUS } from '../models/computador';
import Historico from '../models/historico';
import Conexao from '../models/conexao';
import LancamentoPagamento from '../models/lancamentopagamento';
import Pedido from '../models/pedido';
import PedidoProduto from '../models/pedidoproduto';
import Conta from '../models/conta';
import PagamentoPlano from '@models/pagamentoplano';
import Atendimento from '@models/atendimento';
import Vendedor from '@models/vendedor';
import { infoLicenca } from './../common/criptografia/licenca';

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
        lancamento.status = 64; // Comissionado
        lancamento.conexao = conexao;
        lancamento.tipo = 25;
        lancamento.modelo = '55';
        lancamento.atendimento = null;        
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
      lancamento.estabelecimento = venda.estabelecimento;
      if (!lancamento.estabelecimento)
        throw new Error('estabelecimento não informado');
      lancamento.cliente = venda.cliente;
      lancamento.memorando = venda.memorando;
      lancamento.subtotal = venda.subtotal;
      lancamento.desconto = venda.desconto;
      lancamento.descontoPercentual = 0;
      lancamento.bonificacao = 0;
      lancamento.taxaServico = 0;
      lancamento.taxaEntrega = venda.taxaEntrega;
      lancamento.total = venda.total;
      lancamento.operacao = venda.operacao;
      lancamento.vendedor = venda.vendedor;
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
          if (!pedidoProduto.departamento)
            pedidoProduto.departamento = computador.departamento;
        }
        pedidoProduto.produto = vendaItem.produto;
        pedidoProduto.preco = vendaItem.preco;
        pedidoProduto.qde = vendaItem.qde;
        pedidoProduto.fator = 1;
        pedidoProduto.desconto = vendaItem.desconto || 0;
        pedidoProduto.descontoPercentual = vendaItem.descontoPercentual || 0;
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
        if (!lancamentoPagamento.pagamentoForma) {
          let pagamentoPlano = await getRepository(PagamentoPlano).findOne({ where: { id: pagamento.pagamentoPlano.id }, relations: ['pagamentoForma'] });
          if (!pagamentoPlano || !pagamentoPlano.pagamentoForma)
            throw new Error('plano de pagamento sem forma de pagamento relacionada');
          lancamentoPagamento.pagamentoForma = pagamentoPlano.pagamentoForma;
        }          
        lancamentoPagamento.parcelas = pagamento.parcelas;
        lancamentoPagamento.valor = pagamento.valor;
        if (!lancamentoPagamento.id)
          lancamento.pagamentos.push(lancamentoPagamento);
      }
      //return res.status(201).json(lancamento);
      const retorno = await getRepository(Lancamento).save(lancamento);
      const retornox = await VendaHelper.venda(retorno.id, true);
      // Atualiza os campos lançamento e tipo da tabela pedidos_produtos
      getManager().query(`EXEC Mosaico.sp_Lancamento_Insumos ${retorno.id};`);
      getManager().query(`EXEC Mosaico.sp_Lancamento_AplicaTributacao ${retorno.id};`);
      return res.status(201).json(retornox);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async gravaAtendimento(req: Request, res: Response) {

    try {

      let licenca = await infoLicenca();
      licenca.verificaAtendimentoMesa();

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
      if (!venda.vendedor)
        throw new Error('vendedor não informado');

      const vendedor = await getRepository(Vendedor).findOne({
          where: { id: venda.vendedor.id },
          relations: ['estabelecimento']
        });
      if (!vendedor)
        throw new Error('não existe um vendedor com o id informado');
        
      const atendimento = await getRepository(Atendimento).findOne({
        where: {
          estabelecimento: { id: computador.estabelecimento.id },
          atendimento: venda.atendimento
        },
        relations: ['estabelecimento', 'modalidade']
      });
      /*
        const vendedorx = await getRepository(Vendedor).findOne({
          where: { nome: COMPUTADOR_PROMETHEUS },
          relations: ['estabelecimento']
        });
        if (!vendedorx)
          throw new Error('não existe um vendedor com o nome "PROMETHEUS"');  
      */
      if (!atendimento)
        throw new Error('atendimento inválido');      
      if (!atendimento.ativo)
        throw new Error('atendimento inativo');
      if (!atendimento.modalidade)
        throw new Error('a modalidade do atendimento é inválida');
      if (!atendimento.ambienteid) {
        atendimento.ambienteid = computador.ambienteid;
        if (!atendimento.ambienteid)
          atendimento.ambienteid = 1;
      }
      if (!venda.id)
        venda.id = 0;
      let comissionado = false;
      if ((atendimento.modalidade.id == 17) || (atendimento.modalidade.id == 21) && (vendedor.comissao > 0))
        comissionado = true;
      let s: string[] = [];
      s.push(`DECLARE @LancamentoID BIGINT = ` +venda.id + `;`);
      s.push(`EXEC Mosaico.sp_Lancamento_Garante`);
      s.push(`  @LancamentoID OUTPUT,`);
      s.push(`  0,`);
      s.push(`  0,`);
      s.push(`  ${computador.estabelecimento.id},`);
      s.push(`  0,`); // Histórico: 0 = Padrão
      s.push(`  ${atendimento.modalidade.id},`)
      s.push(`  ${atendimento.atendimento},`)
      s.push(`  '',`);
      s.push(`  0,`);
      s.push(`  0,`);
      s.push(`  ${comissionado},`);
      s.push(`  0;`);
      s.push(`SELECT @LancamentoID id;`);
      let qr = await getManager().query(s.join('\n'));
      let lancamentoid = +qr[0].id;
      // Pedido      
      let lancamento = await getRepository(Lancamento).findOne({ where: { id: lancamentoid }})
      if (!lancamento || !lancamento.id)
        throw new Error('lançamento inválido');
      let pedido: Pedido;
      let item = 0;
      pedido = new Pedido();
      pedido.status = 0;
      if (comissionado)
        pedido.status = 64;
      pedido.estabelecimento = computador.estabelecimento;
      pedido.ambienteid = atendimento.ambienteid;
      pedido.tipo = atendimento.modalidade.id;
      pedido.atendimento = atendimento.atendimento;
      pedido.localizacao = 0;
      pedido.natureza = -1;
      pedido.requisicao = new Date();
      pedido.lancamento = lancamento;
      pedido.entrega = pedido.requisicao;
      pedido.emissao = null;
      pedido.complemento = null;
      pedido.conexao = conexao;
      pedido.pedidoProdutos = [];      
      pedido.vendedor = vendedor;
      pedido.vendedorComissao = vendedor.comissao;
      pedido.vendedorComissaoValor = 0;
      let comissaoBase = 0;
      // Pedidos: Produtos
      for (const vendaItem of venda.itens) {
        let produto = await getRepository(Produto).findOne(vendaItem.id);
        if (!produto?.id)
          throw new Error('produto inválido');
        let subatendimento = vendaItem.subatendimento;
        if (!subatendimento)
          subatendimento = venda.subatendimento || '';
        let pedidoProduto = new PedidoProduto();
        pedidoProduto.status = 0;
        if (comissionado && produto.comissionado)
          pedidoProduto.status = 64;
        pedidoProduto.item = ++item;
        pedidoProduto.conexao = conexao;
        pedidoProduto.subitem = 0;
        pedidoProduto.itemTitular = 0;
        pedidoProduto.entrega = pedido.entrega;
        pedidoProduto.tipo = atendimento.modalidade.id;
        pedidoProduto.atendimento = atendimento.atendimento;
        pedidoProduto.natureza = -1;          
        pedidoProduto.estabelecimento = computador.estabelecimento;
        if (!pedidoProduto.departamento)
          pedidoProduto.departamento = computador.departamento;        
        pedidoProduto.produto = vendaItem.produto;
        pedidoProduto.preco = vendaItem.preco;
        pedidoProduto.qde = vendaItem.qde;
        pedidoProduto.fator = 1;
        pedidoProduto.desconto = vendaItem.desconto || 0;
        pedidoProduto.descontoPercentual = vendaItem.descontoPercentual || 0;
        pedidoProduto.precoTotal = vendaItem.precoTotal;
        pedidoProduto.taxa = 0;
        //pedidoProduto.impressora = ?        
        pedidoProduto.comissionado = comissionado;
        pedidoProduto.subatendimento = subatendimento;
        pedidoProduto.observacoes = vendaItem.observacoes;
        if (!pedidoProduto.id)
          pedido.pedidoProdutos.push(pedidoProduto);
        if ((pedidoProduto.status & 64) > 0)
          comissaoBase += vendaItem.precoTotal;
      }
      if ((comissaoBase > 0) && (pedido.vendedorComissao > 0))
        pedido.vendedorComissaoValor = Math.trunc(((comissaoBase / 100.0) * vendedor.comissao) * 100) / 100;
      const pedidox = await getRepository(Pedido).save(pedido);
      console.log('retorno', pedidox.id);
      const retorno = await VendaHelper.venda(lancamentoid, true);
      // Atualiza os campos lançamento e tipo da tabela pedidos_produtos
      s = [];
      s.push(`UPDATE Mosaico.PedidoProduto SET`);
			s.push(`  Edicao = GETDATE(),`);
			s.push(`  LancamentoID = ${lancamentoid}`);
      s.push(`WHERE PedidoID = ${pedidox.id}`);
      console.log('consulta', s.join('\n'));
      await getManager().query(s.join('\n'));
      //getManager().query(`EXEC Mosaico.sp_Lancamento_Insumos ${retorno.id};`);
      //getManager().query(`EXEC Mosaico.sp_Lancamento_AplicaTributacao ${retorno.id};`);
      return res.status(201).json(retorno);
    } catch (error: any) {
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
          order: { id: 'ASC' },
          take: 100
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
    } catch (error: any) {
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
      s.push(`DECLARE @LancamentoID BIGINT = ` +req.params.id + `;`);
      s.push(`UPDATE Mosaico.Lancamento SET`);
      s.push(`	Edicao = GETDATE(),`);
      s.push(`	[Status] = [Status] | 1,`);
      s.push(`	Emissao = GETDATE()`);
      s.push(`WHERE`);
      s.push(`	(ID = @LancamentoID)`);
      s.push(`	AND (Emissao IS NULL);`);
      s.push(`UPDATE Mosaico.Pedido SET`);
      s.push(`	Edicao = GETDATE(),`);
      s.push(`	[Status] = [Status] | 1,`);
      s.push(`	Natureza = 0	`);
      s.push(`WHERE LancamentoID = @LancamentoID;`);
      s.push(`UPDATE Mosaico.PedidoProduto SET`);
      s.push(`	Edicao = GETDATE(),`);
      s.push(`	[Status] = [Status] | 1,`);
      s.push(`	Natureza = 0,	`);
      s.push(`	Fator = 0`);
      s.push(`WHERE LancamentoID = @LancamentoID;`);
      s.push(`UPDATE Mosaico.LancamentoPagamento SET`);
      s.push(`	Edicao = GETDATE(),`);
      s.push(`	[Status] = [Status] | 1`);
      s.push(`WHERE`);
      s.push(`	(LancamentoID = @LancamentoID)`);
      s.push(`	AND (SP < 200);`);      
      await getManager().query(s.join('\n')); // promise
      res.status(200).send({ message: 'registro excluído' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

}

export default new  VendaController();
