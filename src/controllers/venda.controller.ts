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
      lancamento.operacao = venda.operacao;
      //lancamento.naturezaOperacao = venda.naturezaOperacao;
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
      let s: string[] = [];
      s.push(`DECLARE @LancamentoID INTEGER = ${retorno.id};`);
      s.push(`-- Lançamento`);
      s.push(`DECLARE`);
      s.push(`	@EstabelecimentoID INTEGER = 0,`);
      s.push(`	@Tipo INTEGER = 0,`);
      s.push(`	@OperacaoID INTEGER = 0;`);
      s.push(`SELECT @EstabelecimentoID = EstabelecimentoID, @Tipo = Tipo, @OperacaoID = OperacaoID`);
      s.push(`FROM Mosaico.Lancamento`);
      s.push(`WHERE ID = @LancamentoID;`);
      s.push(`IF (@@ROWCOUNT = 0)`);
      s.push(`	RAISERROR ('Lançamento %d inválido', 16, 1, @LancamentoID);`);
      s.push(`IF (@OperacaoID IS NULL)`);
      s.push(`	RAISERROR ('Operação não informada no lançamento %d', 16, 1, @LancamentoID);`);
      s.push(`-- Natureza da Operação`);
      s.push(`DECLARE @NaturezaOperacao VARCHAR(80);`);
      s.push(`SELECT @NaturezaOperacao = N.Nome`);
      s.push(`FROM`);
      s.push(`	Operacoes O`);
      s.push(`	JOIN NaturezaDaOperacao N ON N.NaturezaDaOperacaoID = O.NaturezaDaOperacaoID`);
      s.push(`WHERE O.OperacaoID = @OperacaoID;`);
      s.push(`UPDATE vwLancamentos SET`);
      s.push(`	Edicao = GETDATE(),`);
      s.push(`	Bonificacao = 0.00,`);
      s.push(`	TipoConsumidor = 0,`);
      s.push(`	NF = 0,`);
      s.push(`	NFENaturezaDaOperacao = @NaturezaOperacao,`);
      s.push(`	NFESaidaEntrada = 1,`);
      s.push(`	NFEFormaDePagamento = 0,`);
      s.push(`	NFEAmbiente = 0,`);
      s.push(`	NFEImpressa = 0,`);
      s.push(`	NFECancelada = 0,`);
      s.push(`	NFEFinalidade = 1,`);
      s.push(`	Seguro = 0,`);
      s.push(`	Transferencia = 0,`);
      s.push(`	DescontoCondicional = 0,`);
      s.push(`	ImportadoXML = 0,`);
      s.push(`	ICMSvFCP = 0.00,`);
      s.push(`	ICMSvFCPST = 0.00,`);
      s.push(`	ICMSvFCPSTRet = 0.00,`);
      s.push(`	IOFValor = 0.00,`);
      s.push(`	DespesasAduaneiras = 0.00`);
      s.push(`WHERE LancamentoID = @LancamentoID;`);
      s.push(`-- Simples Nacional`);
      s.push(`DECLARE @SimplesNacional BIT = 0;`);
      s.push(`IF EXISTS(SELECT * FROM Unidades WHERE (Código = @EstabelecimentoID) AND (RegimeTributario IN (1, 2)))`);
      s.push(`	SET @SimplesNacional = 1;`);
      s.push(`-- Pedidos/Produtos`);
      s.push(`DECLARE`);
      s.push(`	@PedidoProdutoID INTEGER = 0,`);
      s.push(`	@ProdutoID INTEGER = 0,`);
      s.push(`	@Preco MONEY = 0.00,`);
      s.push(`	@Qde REAL = 0.0,`);
      s.push(`	@QdeUN VARCHAR(10),`);
      s.push(`	@PrecoTotal MONEY = 0.00,`);
      s.push(`	@Desconto MONEY = 0.00,`);
      s.push(`	@DescontoPercentual MONEY = 0.00;`);
      s.push(`DECLARE C CURSOR FOR`);
      s.push(`	SELECT`);
      s.push(`		R.ID PedidoProdutoID, R.ProdutoID, R.Preco, R.Qde, D.UN, ISNULL(R.PrecoTotal, 0.00) PrecoTotal, ISNULL(R.Desconto, 0) Desconto,`);
      s.push(`		R.DescontoPercentual`);
      s.push(`	FROM`);
      s.push(`		Mosaico.Pedido P`);
      s.push(`		JOIN Mosaico.PedidoProduto R ON R.PedidoID = P.ID`);
      s.push(`		JOIN Mosaico.Produto D ON D.ID = R.ProdutoID`);
      s.push(`	WHERE`);
      s.push(`		(P.LancamentoID = @LancamentoID)`);
      s.push(`		AND (R.SubItem = 0);`);
      s.push(`OPEN C;`);
      s.push(`WHILE (0 = 0)`);
      s.push(`BEGIN`);
      s.push(`	FETCH NEXT FROM C`);
      s.push(`	INTO @PedidoProdutoID, @ProdutoID, @Preco, @Qde, @QdeUN, @PrecoTotal, @Desconto, @DescontoPercentual;`);
      s.push(`	IF (@@FETCH_STATUS <> 0)`);
      s.push(`		BREAK;	`);
      s.push(`	DECLARE`);
      s.push(`		@OperacaoNome VARCHAR(80),`);
      s.push(`		@ICMSExcluirDoPISCOFINS	BIT = 0,`);
      s.push(`		@CFOPID	SMALLINT = NULL,`);
      s.push(`		@ICMSCalcula BIT = 0,`);
      s.push(`		@ICMSPercentual DECIMAL(7, 2) = 0.00,`);
      s.push(`		@ICMSBase MONEY = 0.00,`);
      s.push(`		@ICMSValor MONEY = 0.00,`);
      s.push(`		@ICMSReducao DECIMAL(7, 2) = 0.00,`);
      s.push(`		@ICMSTributacao	VARCHAR(2) = NULL,`);
      s.push(`		@ICMSCSTA SMALLINT = 0,`);
      s.push(`		@ICMSCSTB SMALLINT = 0,`);
      s.push(`		@ICMSCSOSN SMALLINT = 0,`);
      s.push(`		@IPICalcula	BIT = 0,`);
      s.push(`		@IPIPercentual DECIMAL(7, 2) = NULL,`);
      s.push(`		@IPIBase MONEY = 0.00,`);
      s.push(`		@IPIValor MONEY = 0.00,`);
      s.push(`		@IPICST INTEGER = 0,`);
      s.push(`		@PISCalcula	BIT = 0,`);
      s.push(`		@PISPercentual DECIMAL(7, 2) = NULL,`);
      s.push(`		@PISBase MONEY = 0.00,`);
      s.push(`		@PISValor MONEY = 0.00,`);
      s.push(`		@PISCST INTEGER = 0,`);
      s.push(`		@COFINSCalcula BIT = 0,`);
      s.push(`		@COFINSPercentual DECIMAL(7, 2) = NULL,`);
      s.push(`		@COFINSBase MONEY = 0.00,`);
      s.push(`		@COFINSValor MONEY = 0.00,`);
      s.push(`		@COFINSCST SMALLINT = 0,`);
      s.push(`		@CalculoBase MONEY = 0.00;`);
      s.push(`	DECLARE @TributacaoOperacaoID INTEGER = 0;`);
      s.push(`	SELECT @TributacaoOperacaoID = O.TributacaoOperacaoID`);
      s.push(`	FROM`);
      s.push(`		vwTributacoesOperacoes O`);
      s.push(`		JOIN vwProdutosUnidades U ON U.TributacaoID = O.TributacaoID`);
      s.push(`	WHERE`);
      s.push(`		(U.ProdutoID = @ProdutoID)`);
      s.push(`		AND (U.UnidadeID = @EstabelecimentoID)`);
      s.push(`		AND (O.OperacaoID = @OperacaoID);`);
      s.push(`	IF (@TributacaoOperacaoID IS NULL)`);
      s.push(`		RAISERROR ('Tributação não informada para o produto %d', 16, 1, @ProdutoID);`);
      s.push(`	SELECT`);
      s.push(`		@OperacaoNome = Ope.OperacaoNome, @ICMSExcluirDoPISCOFINS = Ope.ExcluirICMS_PISCOFINS, @COFINSCalcula = Ope.CalculaCOFINS,`);
      s.push(`		@CFOPID = TriC.CFOPID,`);
      s.push(`		@ICMSCalcula = Ope.CalculaICMS, @ICMSPercentual = ICMS.ICMSPercentual, @ICMSReducao = ICMS.ICMSReducao, @ICMSTributacao = ICMS.ICMSTributacao, @ICMSCSTA = ICMS.CSTA, @ICMSCSTB = ICMS.CSTB, @ICMSCSOSN = ICMS.CSOSN,`);
      s.push(`		@IPICalcula = Ope.CalculaIPI, @IPIPercentual = IPI.IPIPercentual, @IPICST = IPI.CST,`);
      s.push(`		@PISCalcula = Ope.CalculaPIS, @PISPercentual = PIS.PISPercentual, @PISCST = PIS.CST,`);
      s.push(`		@COFINSCalcula = Ope.CalculaCOFINS, @COFINSPercentual = COFINS.COFINSPercentual, @COFINSCST = COFINS.CST`);
      s.push(`	FROM`);
      s.push(`		Operacoes Ope`);
      s.push(`		JOIN TributacoesOperacoes TriO ON TriO.OperacaoID = Ope.OperacaoID`);
      s.push(`		JOIN TributacoesOperacoesCFOPs TriC ON TriC.TributacaoOperacaoID = TriO.TributacaoOperacaoID`);
      s.push(`		LEFT JOIN Fiscal.CalculosICMS ICMS ON TriO.CalculoICMSID = ICMS.CalculoICMSID`);
      s.push(`		LEFT JOIN Fiscal.CalculosCOFINS COFINS ON TriO.CalculoCOFINSID = COFINS.CalculoCOFINSID`);
      s.push(`		LEFT JOIN Fiscal.CalculosPIS PIS ON TriO.CalculoPISID = PIS.CalculoPISID`);
      s.push(`		LEFT JOIN Fiscal.CalculosIPI IPI ON TriO.CalculoIPIID = IPI.CalculoIPIID`);
      s.push(`	WHERE`);
      s.push(`		(Ope.OperacaoID = @OperacaoID)`);
      s.push(`		AND (TriO.TributacaoOperacaoID = @TributacaoOperacaoID)`);
      s.push(`		AND (TriC.Favorito = 1);`);
      s.push(`	IF (@@ROWCOUNT = 0)`);
      s.push(`		RAISERROR ('Tributação não informada para o produto %d', 16, 1, @ProdutoID);`);
      s.push(`	IF (@SimplesNacional = 1)`);
      s.push(`		SET @ICMSCSTB = 0`);
      s.push(`	ELSE`);
      s.push(`		SET @ICMSCSOSN = 0;`);
      s.push(`	-- ICMS	`);
      s.push(`	IF ((@ICMSCalcula = 1) AND (@ICMSPercentual > 0))`);
      s.push(`	BEGIN`);
      s.push(`		SET @ICMSBase = @PrecoTotal;`);
      s.push(`		IF (@ICMSReducao > 0)`);
      s.push(`			SET @ICMSBase = ROUND((@PrecoTotal - @Desconto) * (1 - (@ICMSReducao / 100.0)), 2, 1);`);
      s.push(`		SET @ICMSValor = ROUND(@ICMSBase * (@ICMSPercentual / 100.0), 2, 1);`);
      s.push(`	END ELSE`);
      s.push(`	BEGIN`);
      s.push(`		SET @ICMSPercentual = 0.00;`);
      s.push(`		SET @ICMSBase = 0.00;`);
      s.push(`		SET @ICMSReducao = 0.00;`);
      s.push(`		SET @ICMSValor = 0.00;`);
      s.push(`	END;`);
      s.push(`	-- IPI`);
      s.push(`	IF ((@IPICalcula = 1) AND (@IPIPercentual > 0))`);
      s.push(`	BEGIN`);
      s.push(`		SET @IPIBase = @PrecoTotal;`);
      s.push(`		SET @IPIValor = ROUND(@IPIBase * (@IPIPercentual / 100.0), 2, 1);`);
      s.push(`	END ELSE`);
      s.push(`	BEGIN`);
      s.push(`		SET @IPIPercentual = NULL;`);
      s.push(`		SET @IPIBase = NULL;`);
      s.push(`		SET @IPIValor = NULL;`);
      s.push(`	END;`);
      s.push(`	-- PIS/COFINS, REDUÇÃO`);
      s.push(`	SET @CalculoBase = @PrecoTotal;`);
      s.push(`	IF (@ICMSExcluirDoPISCOFINS = 1)`);
      s.push(`	BEGIN`);
      s.push(`		SET @CalculoBase = @CalculoBase - @ICMSValor;`);
      s.push(`		IF (@CalculoBase <= 0.00)`);
      s.push(`			SET @CalculoBase = 0.00;`);
      s.push(`	END;`);
      s.push(`	-- PIS`);
      s.push(`	IF ((@PISCalcula = 1) AND (@PISPercentual > 0))`);
      s.push(`	BEGIN`);
      s.push(`		SET @PISBase = @CalculoBase;`);
      s.push(`		SET @PISValor = ROUND(@PISBase * (@PISPercentual / 100.0), 2, 1);`);
      s.push(`	END ELSE`);
      s.push(`	BEGIN`);
      s.push(`		SET @PISBase = NULL;`);
      s.push(`		SET @PISPercentual = NULL;`);
      s.push(`		SET @PISValor = NULL;`);
      s.push(`	END;`);
      s.push(`	-- COFINS`);
      s.push(`	IF ((@COFINSCalcula = 1) AND (@COFINSPercentual > 0))`);
      s.push(`	BEGIN`);
      s.push(`		SET @COFINSBase = @CalculoBase;`);
      s.push(`		SET @COFINSValor = ROUND(@COFINSBase * (@COFINSPercentual / 100.0), 2, 1);`);
      s.push(`	END ELSE`);
      s.push(`	BEGIN`);
      s.push(`		SET @COFINSBase = NULL;`);
      s.push(`		SET @COFINSPercentual = NULL;`);
      s.push(`		SET @COFINSValor = NULL;`);
      s.push(`	END;`);
      s.push(`	-- Atualiza os impostos`);
      s.push(`	UPDATE vwPedidosProdutos SET`);
      s.push(`		Edicao = GETDATE(),`);
      s.push(`		LancamentoID = @LancamentoID,`);
      s.push(`		Tipo = @Tipo,`);
      s.push(`		FatorUN = @QdeUN,`);
      s.push(`		ECFItem = 0,`);
      s.push(`		ISS = 0.00,`);
      s.push(`		ICMS = @ICMSPercentual,`);
      s.push(`		CFOP = @CFOPID,`);
      s.push(`		CSTA = @ICMSCSTA,`);
      s.push(`		CSTB = @ICMSCSTB,`);
      s.push(`		CSOSN = @ICMSCSOSN,`);
      s.push(`		Tributacao2 = @ICMSTributacao,`);
      s.push(`		ICMSPercentual = @ICMSPercentual,`);
      s.push(`		ICMSBase = @ICMSBase,`);
      s.push(`		ICMSPercRedBaseCalc = @ICMSReducao,`);
      s.push(`		ICMSValor = @ICMSValor,`);
      s.push(`		CSTIPI = @IPICST,`);
      s.push(`		IPIBase = @IPIBase,`);
      s.push(`		IPIPercentual = @IPIPercentual,`);
      s.push(`		IPIValor = @IPIValor,`);
      s.push(`		CSTPIS = @PISCST,`);
      s.push(`		PISBase = @PISBase,`);
      s.push(`		PISPercentual = @PISPercentual,`);
      s.push(`		PISValor = @PISValor,`);
      s.push(`		CSTCOFINS = @COFINSCST,`);
      s.push(`		COFINSBase = @COFINSBase,`);
      s.push(`		COFINSPercentual = @COFINSPercentual,`);
      s.push(`		COFINSValor = @COFINSValor`);
      s.push(`	WHERE PedidoProdutoID = @PedidoProdutoID;`);
      s.push(`END;`);
      s.push(`CLOSE C;`);
      s.push(`DEALLOCATE C;`);
      console.log(s.join('\n'));
      await getManager().query(s.join('\n')); // promise
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
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

}

export default new  VendaController();
