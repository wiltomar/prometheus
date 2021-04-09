IF (OBJECT_ID('Mosaico.sp_Lancamento_Insumos') IS NOT NULL)
	DROP PROCEDURE Mosaico.sp_Lancamento_Insumos;
GO
CREATE PROCEDURE Mosaico.sp_Lancamento_Insumos
(
	@LancamentoID BIGINT
)
AS
BEGIN
	-- Exclui os subitens anteriores
	DECLARE @SubItemMax INT = 0;
	SELECT @SubItemMax = MAX(SubItem)
	FROM Mosaico.PedidoProduto
	WHERE LancamentoID = @LancamentoID;
	IF (@SubItemMax IS NULL)
		SET @SubItemMax = 0;
	UPDATE Mosaico.PedidoProduto SET
		Edicao = GETDATE(),
		SubItem = SubItem + @SubItemMax,
		Fator = 0
	WHERE
		(LancamentoID = @LancamentoID)
		AND (SubItem > 0);
	DECLARE
		@ConexaoID BIGINT = 0,
		@EstabelecimentoID INT = 0,
		@Tipo INTEGER = 0,	
		@Atendimento INTEGER = 0,
		@Emissao DATETIME = NULL;
	SELECT @EstabelecimentoID = EstabelecimentoID, @Tipo = Tipo, @Atendimento = Atendimento, @Emissao = Emissao
	FROM Mosaico.Lancamento
	WHERE ID = @LancamentoID;
	IF (@@ROWCOUNT = 0)
		RAISERROR ('Lançamento %d inválido', 16, 1, @LancamentoID);
	IF (@Emissao IS NOT NULL)
		RAISERROR ('Lançamento %d já encerrado', 16, 1, @LancamentoID);
	DECLARE
		@PedidoID BIGINT,
		@PedidoProdutoID BIGINT,
		@Item INTEGER,
		@ProdutoID BIGINT,
		@Natureza SMALLINT,
		@Qde REAL,
		@Fator REAL,
		@Entrega DATETIME,
		@AmbienteID INTEGER,  
		@DepartamentoID INTEGER,
		@ImpressoraID INT;
	DECLARE C CURSOR FOR
		SELECT
			R.PedidoID, R.ID PedidoProdutoID, R.Item, R.ProdutoID, P.Natureza, R.Qde, R.Fator,
			R.Entrega, P.AmbienteID, R.DepartamentoID, R.ImpressoraID
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
			@PedidoID, @PedidoProdutoID, @Item, @ProdutoID, @Natureza, @Qde, @Fator,
			@Entrega, @AmbienteID, @DepartamentoID, @ImpressoraID;
		IF (@@FETCH_STATUS <> 0)
			BREAK;
		INSERT INTO Mosaico.PedidoProduto
		(
		  Inclusao,
		  Edicao,
		  Status,
		  ConexaoID,
		  LancamentoID,
		  PedidoID,
		  Tipo,
		  Atendimento,
		  SubAtendimento,
		  Natureza,
		  EstabelecimentoID,
		  DepartamentoID,
		  ImpressoraID,
		  ItemTitular,
		  Item,
		  SubItem,
		  ProdutoID,
		  Preco,
		  QDE,
		  Fator,
		  Desconto,
		  DescontoPercentual,
		  PrecoTotal,
		  Observacoes,
		  Entrega,
		  Taxa,
		  Comissionado
		)
		SELECT
		  GETDATE() Inclusao,
		  GETDATE() Edicao,
		  0 Status,
		  @ConexaoID ConexaoID,
		  @LancamentoID LancamentoID,
		  @PedidoID PedidoID,
		  @Tipo Tipo,
		  @Atendimento Atendimento,
		  NULL SubAtendimento,
		  @Natureza,
		  @EstabelecimentoID EstabelecimentoID,
		  DepartamentoID,
		  ImpressoraID,
		  0 ItemTitular,
		  @Item Item,
		  ID SubItem,
		  ProdutoID,
		  0.00 Preco,
		  QDE,
		  Fator,
		  0.00 Desconto,
		  0.00 DescontoPercentual,
		  0.00 PrecoTotal,
		  NULL Observacoes,
		  @Entrega Entrega,
		  0 Taxa,
		  0 Comissionado
		FROM Mosaico.fn_Produto_Insumos
		(
		  @ProdutoID,
		  @Qde,
		  @Fator,
		  @EstabelecimentoID,
		  @AmbienteID,
		  @DepartamentoID,
		  @ImpressoraID
		);
	END;
	CLOSE C;
	DEALLOCATE C;
	RETURN 1;
END;
GO