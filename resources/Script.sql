IF (OBJECT_ID('Mosaico.sp_Lancamento_AplicaTributacao') IS NOT NULL)
	DROP PROCEDURE Mosaico.sp_Lancamento_AplicaTributacao;
GO
CREATE PROCEDURE Mosaico.sp_Lancamento_AplicaTributacao
(
	@LancamentoID BIGINT
)
AS
BEGIN
	-- Lançamento
	DECLARE
		@EstabelecimentoID INTEGER = 0,
		@Tipo INTEGER = 0,
		@OperacaoID INTEGER = 0,
		@SubTotal MONEY = 0.00,
		@DescontoValor MONEY = 0.00,
		@DescontoPercentual DECIMAL(7, 2),
		@DescontoSaldo MONEY = 0.00,
		@PedidoProdutoResidualID BIGINT = 0;
	SELECT @EstabelecimentoID = EstabelecimentoID, @Tipo = Tipo, @OperacaoID = OperacaoID, @SubTotal = SubTotal, @DescontoValor = Desconto
	FROM Mosaico.Lancamento
	WHERE ID = @LancamentoID;
	IF (@DescontoValor IS NULL)
		SET @DescontoValor = 0.00;
	SET @DescontoSaldo = @DescontoValor;
	SET @DescontoPercentual = ROUND((@DescontoValor / @SubTotal) * 100.0, 2, 1);
	IF (@@ROWCOUNT = 0)
		RAISERROR ('Lançamento %d inválido', 16, 1, @LancamentoID);
	IF (@OperacaoID IS NULL)
		RAISERROR ('Operação não informada no lançamento %d', 16, 1, @LancamentoID);
	-- Natureza da Operação
	DECLARE @NaturezaOperacao VARCHAR(80);
	SELECT @NaturezaOperacao = N.Nome
	FROM
		Operacoes O
		JOIN NaturezaDaOperacao N ON N.NaturezaDaOperacaoID = O.NaturezaDaOperacaoID
	WHERE O.OperacaoID = @OperacaoID;
	UPDATE vwLancamentos SET
		Edicao = GETDATE(),
		Bonificacao = 0.00,
		TipoConsumidor = 0,
		NF = 0,
		NFENaturezaDaOperacao = @NaturezaOperacao,
		NFESaidaEntrada = 1,
		NFEFormaDePagamento = 0,
		NFEAmbiente = 0,
		NFEImpressa = 0,
		NFECancelada = 0,
		NFEFinalidade = 1,
		Seguro = 0,
		Transferencia = 0,
		DescontoCondicional = 0,
		ImportadoXML = 0,
		ICMSvFCP = 0.00,
		ICMSvFCPST = 0.00,
		ICMSvFCPSTRet = 0.00,
		IOFValor = 0.00,
		DespesasAduaneiras = 0.00
	WHERE LancamentoID = @LancamentoID;
	-- Simples Nacional
	DECLARE @SimplesNacional BIT = 0;
	IF EXISTS(SELECT * FROM Unidades WHERE (Código = @EstabelecimentoID) AND (RegimeTributario IN (1, 2)))
		SET @SimplesNacional = 1;
	-- Pedidos/Produtos
	DECLARE
		@PedidoProdutoID INTEGER = 0,
		@ProdutoID INTEGER = 0,
		@Preco MONEY = 0.00,
		@Qde REAL = 0.0,
		@QdeUN VARCHAR(10),
		@PrecoTotal MONEY = 0.00,
		@PedidoProdutoDesconto MONEY = 0.00,
		@AliquotaAproxNacional DECIMAL(7, 2) = 0.00,
		@AliquotaAproxImportados DECIMAL(7, 2) = 0.00,
		@AliquotaAproxMunicipal DECIMAL(7, 2) = 0.00,
		@AliquotaAproxEstadual DECIMAL(7, 2) = 0.00;
	DECLARE C CURSOR FOR
		SELECT
			R.ID PedidoProdutoID, R.ProdutoID, R.Preco, R.Qde, D.UNE UN, ISNULL(R.PrecoTotal, 0.00) PrecoTotal,
			D.AliquotaAproxNacional, D.AliquotaAproxImportados, D.AliquotaAproxMunicipal, D.AliquotaAproxEstadual
		FROM
			Mosaico.Pedido P
			JOIN Mosaico.PedidoProduto R ON R.PedidoID = P.ID
			JOIN Produtos D ON D.Código = R.ProdutoID
		WHERE
			(P.LancamentoID = @LancamentoID)
			AND (R.SubItem = 0);
	OPEN C;
	WHILE (0 = 0)
	BEGIN
		FETCH NEXT FROM C
		INTO
			@PedidoProdutoID, @ProdutoID, @Preco, @Qde, @QdeUN, @PrecoTotal,
			@AliquotaAproxNacional, @AliquotaAproxImportados, @AliquotaAproxMunicipal, @AliquotaAproxEstadual;
		IF (@@FETCH_STATUS <> 0)
		BEGIN
			IF (@DescontoSaldo > 0.00)
			BEGIN
			  UPDATE Mosaico.PedidoProduto SET
				Edicao = GETDATE(),
				Desconto = Desconto + @DescontoSaldo
			  WHERE
				(ID = @PedidoProdutoResidualID)
				AND (LancamentoID = @LancamentoID)
			END;
			BREAK;
		END;
		DECLARE
			@OperacaoNome VARCHAR(80),
			@ICMSExcluirDoPISCOFINS	BIT = 0,
			@CFOPID	SMALLINT = NULL,
			@ICMSCalcula BIT = 0,
			@ICMSPercentual DECIMAL(7, 2) = 0.00,
			@ICMSBase MONEY = 0.00,
			@ICMSValor MONEY = 0.00,
			@ICMSReducao DECIMAL(7, 2) = 0.00,
			@ICMSTributacao	VARCHAR(2) = NULL,
			@ICMSCSTA SMALLINT = 0,
			@ICMSCSTB SMALLINT = 0,
			@ICMSCSOSN SMALLINT = 0,
			@IPICalcula	BIT = 0,
			@IPIPercentual DECIMAL(7, 2) = NULL,
			@IPIBase MONEY = 0.00,
			@IPIValor MONEY = 0.00,
			@IPICST INTEGER = 0,
			@PISCalcula	BIT = 0,
			@PISPercentual DECIMAL(7, 2) = NULL,
			@PISBase MONEY = 0.00,
			@PISValor MONEY = 0.00,
			@PISCST INTEGER = 0,
			@COFINSCalcula BIT = 0,
			@COFINSPercentual DECIMAL(7, 2) = NULL,
			@COFINSBase MONEY = 0.00,
			@COFINSValor MONEY = 0.00,
			@COFINSCST SMALLINT = 0,
			@CalculoBase MONEY = 0.00;
		DECLARE @TributacaoOperacaoID INTEGER = 0;
		SELECT @TributacaoOperacaoID = O.TributacaoOperacaoID
		FROM
			vwTributacoesOperacoes O
			JOIN vwProdutosUnidades U ON U.TributacaoID = O.TributacaoID
		WHERE
			(U.ProdutoID = @ProdutoID)
			AND (U.UnidadeID = @EstabelecimentoID)
			AND (O.OperacaoID = @OperacaoID);
		IF (@TributacaoOperacaoID IS NULL)
			RAISERROR ('Tributação não informada para o produto %d', 16, 1, @ProdutoID);
		SELECT @CFOPID = CFOPID
		FROM TributacoesOperacoesCFOPs
		WHERE
			(TributacaoOperacaoID = @TributacaoOperacaoID)
			AND (Favorito = 1);
		IF (@CFOPID IS NULL)
			RAISERROR ('CFOP favorito não configurado para o produto %d, tributação-operação %d', 16, 1, @ProdutoID, @TributacaoOperacaoID);
		SELECT
			@OperacaoNome = Ope.OperacaoNome, @ICMSExcluirDoPISCOFINS = Ope.ExcluirICMS_PISCOFINS, @COFINSCalcula = Ope.CalculaCOFINS,
			@ICMSCalcula = Ope.CalculaICMS, @ICMSPercentual = ICMS.ICMSPercentual, @ICMSReducao = ICMS.ICMSReducao, @ICMSTributacao = ICMS.ICMSTributacao, @ICMSCSTA = ICMS.CSTA, @ICMSCSTB = ICMS.CSTB, @ICMSCSOSN = ICMS.CSOSN,
			@IPICalcula = Ope.CalculaIPI, @IPIPercentual = IPI.IPIPercentual, @IPICST = IPI.CST,
			@PISCalcula = Ope.CalculaPIS, @PISPercentual = PIS.PISPercentual, @PISCST = PIS.CST,
			@COFINSCalcula = Ope.CalculaCOFINS, @COFINSPercentual = COFINS.COFINSPercentual, @COFINSCST = COFINS.CST
		FROM
			Operacoes Ope
			JOIN TributacoesOperacoes TriO ON TriO.OperacaoID = Ope.OperacaoID		
			LEFT JOIN Fiscal.CalculosICMS ICMS ON TriO.CalculoICMSID = ICMS.CalculoICMSID
			LEFT JOIN Fiscal.CalculosCOFINS COFINS ON TriO.CalculoCOFINSID = COFINS.CalculoCOFINSID
			LEFT JOIN Fiscal.CalculosPIS PIS ON TriO.CalculoPISID = PIS.CalculoPISID
			LEFT JOIN Fiscal.CalculosIPI IPI ON TriO.CalculoIPIID = IPI.CalculoIPIID
		WHERE
			(Ope.OperacaoID = @OperacaoID)
			AND (TriO.TributacaoOperacaoID = @TributacaoOperacaoID)
		IF (@@ROWCOUNT = 0)
			RAISERROR ('Tributação não informada para o produto %d, operação %d, tributação operação %d', 16, 1, @ProdutoID, @OperacaoID, @TributacaoOperacaoID);
		IF (@PedidoProdutoResidualID = 0)
			SET @PedidoProdutoResidualID = @PedidoProdutoID;
		SET @PedidoProdutoDesconto = 0.00;
		IF (@DescontoPercentual > 0.00)
			SET @PedidoProdutoDesconto = ROUND(@PrecoTotal * (@DescontoPercentual / 100.0), 2, 1);
		IF (@SimplesNacional = 1)
			SET @ICMSCSTB = 0
		ELSE
			SET @ICMSCSOSN = 0;
		-- ICMS	
		IF ((@ICMSCalcula = 1) AND (@ICMSPercentual > 0))
		BEGIN
			SET @ICMSBase = @PrecoTotal;
			IF (@ICMSReducao > 0)
				SET @ICMSBase = ROUND((@PrecoTotal - @PedidoProdutoDesconto) * (1 - (@ICMSReducao / 100.0)), 2, 1);
			SET @ICMSValor = ROUND(@ICMSBase * (@ICMSPercentual / 100.0), 2, 1);
		END ELSE
		BEGIN
			SET @ICMSPercentual = 0.00;
			SET @ICMSBase = 0.00;
			SET @ICMSReducao = 0.00;
			SET @ICMSValor = 0.00;
		END;
		-- IPI
		IF ((@IPICalcula = 1) AND (@IPIPercentual > 0))
		BEGIN
			SET @IPIBase = @PrecoTotal;
			SET @IPIValor = ROUND(@IPIBase * (@IPIPercentual / 100.0), 2, 1);
		END ELSE
		BEGIN
			SET @IPIPercentual = NULL;
			SET @IPIBase = NULL;
			SET @IPIValor = NULL;
		END;
		-- PIS/COFINS, REDUÇÃO
		SET @CalculoBase = @PrecoTotal;
		IF (@ICMSExcluirDoPISCOFINS = 1)
		BEGIN
			SET @CalculoBase = @CalculoBase - @ICMSValor;
			IF (@CalculoBase <= 0.00)
				SET @CalculoBase = 0.00;
		END;
		-- PIS
		IF ((@PISCalcula = 1) AND (@PISPercentual > 0))
		BEGIN
			SET @PISBase = @CalculoBase;
			SET @PISValor = ROUND(@PISBase * (@PISPercentual / 100.0), 2, 1);
		END ELSE
		BEGIN
			SET @PISBase = NULL;
			SET @PISPercentual = NULL;
			SET @PISValor = NULL;
		END;
		-- COFINS
		IF ((@COFINSCalcula = 1) AND (@COFINSPercentual > 0))
		BEGIN
			SET @COFINSBase = @CalculoBase;
			SET @COFINSValor = ROUND(@COFINSBase * (@COFINSPercentual / 100.0), 2, 1);
		END ELSE
		BEGIN
			SET @COFINSBase = NULL;
			SET @COFINSPercentual = NULL;
			SET @COFINSValor = NULL;
		END;
		-- Atualiza
		UPDATE vwPedidosProdutos SET
			Edicao = GETDATE(),
			LancamentoID = @LancamentoID,
			Tipo = @Tipo,
			FatorUN = @QdeUN,
			ECFItem = 0,
			DescontoPercentual = @DescontoPercentual,
			Desconto = @PedidoProdutoDesconto,
			ISS = 0.00,
			ICMS = @ICMSPercentual,
			CFOP = @CFOPID,
			CSTA = @ICMSCSTA,
			CSTB = @ICMSCSTB,
			CSOSN = @ICMSCSOSN,
			Tributacao2 = @ICMSTributacao,
			ICMSPercentual = @ICMSPercentual,
			ICMSBase = @ICMSBase,
			ICMSPercRedBaseCalc = @ICMSReducao,
			ICMSValor = @ICMSValor,
			CSTIPI = @IPICST,
			IPIBase = @IPIBase,
			IPIPercentual = @IPIPercentual,
			IPIValor = @IPIValor,
			CSTPIS = @PISCST,
			PISBase = @PISBase,
			PISPercentual = @PISPercentual,
			PISValor = @PISValor,
			CSTCOFINS = @COFINSCST,
			COFINSBase = @COFINSBase,
			COFINSPercentual = @COFINSPercentual,
			COFINSValor = @COFINSValor,
			AliquotaAproxNacional = @AliquotaAproxNacional,
			ValorAproxNacional = ROUND((@AliquotaAproxNacional / 100.0) * PrecoTotal, 2),
			AliquotaAproxImportados = @AliquotaAproxImportados,
			ValorAproxImportados = ROUND((@AliquotaAproxImportados / 100.0) * PrecoTotal, 2),
			AliquotaAproxMunicipal = @AliquotaAproxMunicipal,
			ValorAproxMunicipal = ROUND((@AliquotaAproxMunicipal / 100.0) * PrecoTotal, 2),
			AliquotaAproxEstadual = @AliquotaAproxEstadual,
			ValorAproxEstadual = ROUND((@AliquotaAproxEstadual / 100.0) * PrecoTotal, 2)
		WHERE PedidoProdutoID = @PedidoProdutoID;
		SET @DescontoSaldo = @DescontoSaldo - @PedidoProdutoDesconto;
	END;
	CLOSE C;
	DEALLOCATE C;
	RETURN 1;
END;
GO