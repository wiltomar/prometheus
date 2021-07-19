IF (SCHEMA_ID('Mosaico') IS NULL)
	EXEC sp_executesql 'CREATE SCHEMA Mosaico;';
GO
ALTER TABLE Produtos ADD
	TemInsumos BIT,
	TemMontagem BIT,
	TemVariosSabores BIT,
	TemVariosSaboresQde TINYINT,
	TemAdicionais BIT,
	TemOpcionais BIT,
	TemObservacoes BIT;
GO
ALTER TABLE Computadores ADD
	AmbienteID SMALLINT,
	Balcao BIT,
	Mesa BIT,
	Cartao BIT,
	PadraoTela TINYINT,
	PadraoModalidade TINYINT,
	TelaPrincipalTeclado TINYINT
GO
ALTER TABLE Pedidos ADD
	PedidoOrigemID INT;
GO
ALTER TABLE Pedidos_Produtos ADD
	ImpressoraID SMALLINT,
	SubAtendimento VARCHAR(20);
GO
ALTER TABLE Lan�amentos ADD
	LancamentoOrigemID INT,
	SequenciaItens INT;
GO
ALTER TABLE Atendimentos ADD
	Ocupacao DATETIME;
GO
ALTER TABLE Conex�es ADD
	UltimaRequisicao DATETIME;
GO
ALTER TABLE Contas ADD
	Sess�oDoPagamento INT,
	Sess�oDoRecebimento INT;
GO
ALTER TABLE Lan�amentos_FormasDePagamento ADD
	PlanoDePagamentoID SMALLINT;
GO
ALTER TABLE Integracao.[Order] ADD
	integrationstatuscode smallint NOT NULL,
	integrationstatusmensagem varchar(400) NULL;
GO
ALTER TABLE Integracao.[Transaction] ADD
	integrationstatuscode smallint NOT NULL,
	integrationstatusmensagem varchar(400) NULL;
GO
ALTER TABLE Clientes ADD
	RFID VARCHAR(40);
GO
ALTER TABLE Fornecedores ADD
	RFID VARCHAR(40);
GO
ALTER TABLE PlanosDePagamento ADD
	Sigla VARCHAR(20);
GO
ALTER TABLE Sess�es ADD
	Usu�rio INT;
GO
ALTER TABLE Lan�amentos ADD
	Sess�oDaEmiss�o INT;
GO
ALTER TABLE Lan�amentos ADD
	TipoDeEmiss�o TINYINT;
GO
ALTER TABLE Lan�amentos_FormasDePagamento ADD
	Troco MONEY;
GO
CREATE INDEX IX_ContasSessaoDoRecebimento ON Contas(Sess�oDoRecebimento);
GO
CREATE INDEX IX_ContasSessaoDoPagamento ON Contas(Sess�oDoRecebimento);
GO
ALTER TABLE Lan�amentos ADD
	LancamentoDestinoID INT;
GO
ALTER TABLE Pedidos ADD
	LancamentoOrigemID INT;
GO
ALTER TABLE Pedidos_Produtos ADD
	LancamentoOrigemID INT;
GO
ALTER TABLE Unidades_Ambientes ADD DataDaInclus�o DATETIME NULL
GO
CREATE INDEX IX_ProdutosUnidades ON Produtos_Unidades(Produto, Unidade) INCLUDE (Ativo);
GO
ALTER TABLE Contas_CC ADD
	NSU VARCHAR(20) NULL,
	Adquirente TINYINT NOT NULL,
	Bandeira SMALLINT NOT NULL,
	Produto TINYINT NOT NULL,
	RetornoTEFItemAgendamentoID INT NULL,
	RetornoTEFItemPagamentoID INT NULL;
GO
ALTER TABLE Computadores ADD
	Tema TINYINT;
GO
ALTER TABLE  Lan�amentos_Vendas ADD
	EntregaSituacao TINYINT;
GO
ALTER TABLE ProdutosPrecosDeVenda ADD
	ID INT,
	Inclusao DATETIME;
GO
ALTER TABLE Computadores ADD
	PadraoMonitor TINYINT;
GO
ALTER TABLE Categorias ADD
	Balanca BIT;
GO
ALTER TABLE Lan�amentos_FormasDePagamento ADD
	DFEPagamentoID INT;
GO
ALTER TABLE Computadores ADD
	VendaFinalizadaAcao SMALLINT;
GO
ALTER TABLE Categorias ADD
	Nivel VARCHAR(10),
	Prefixo VARCHAR(80),
	Analitica BIT
GO
CREATE UNIQUE INDEX IX_Categorias_Niveis ON Categorias(Nivel, C�digo);
GO
ALTER TABLE Computadores ADD
	PrecoID SMALLINT;
GO
ALTER TABLE Categorias ADD
	FotoBase64 TEXT;
GO
ALTER TABLE Sess�es ADD
	ConclusaoMemorando TEXT;
GO
ALTER TABLE PagamentoProcessar ADD
	TEF BIT;
GO
ALTER TABLE Atendimentos ADD
	ClienteID INT;
GO
ALTER TABLE Computadores ADD
	TEFIntegradora SMALLINT;
GO
ALTER TABLE Atendimentos ADD
	Consumacao BIT;
GO
CREATE NONCLUSTERED INDEX IX_ProdutosPrecosDeVenda ON dbo.ProdutosPrecosDeVenda
(
	ProdutoID,
	PrecoID,
	Preco
);
GO
ALTER TABLE dbo.Lan�amentos_Vendas ADD
	Consumo TINYINT;
GO
ALTER TABLE dbo.Lan�amentos_Vendas ADD
	EntregaCelulares VARCHAR(120);
GO
ALTER TABLE ProdutosImagens ADD
	ImagemUrl VARCHAR(120);
GO
ALTER TABLE Pedidos ADD
	Complemento TEXT;
GO
ALTER TABLE Pedidos ADD
	IntegracaoSituacao TINYINT;
GO
ALTER TABLE Computadores ADD
	VendaInterface TINYINT;
GO
ALTER TABLE Computadores ADD
	Parametros TEXT;
GO
ALTER TABLE Produtos ADD
	IntegracaoConfirmacaoAutomatica BIT;
GO
ALTER TABLE Produtos ADD
	Observa��o9 TINYINT,
	Observa��o10 TINYINT,
	Observa��o11 TINYINT,
	Observa��o12 TINYINT;
GO
ALTER TABLE Unidades ADD
	EnvioAutomaticoXMLsDestinatario VARCHAR(80) NULL,
	EnvioAutomaticoXMLsCFe BIT NULL,
	EnvioAutomaticoXMLsNFe BIT NULL,
	EnvioAutomaticoXMLsNFCe BIT NULL
GO
CREATE INDEX IX_Requisicao ON Integracao.Requisicao (LancamentoID);
GO
ALTER TABLE Fornecedores ADD RestringirUnidades BIT;
GO
/*CREATE INDEX IX_Conexoes_Requisicao ON Conex�es(UltimaRequisicao, S_Programa);
GO*/
ALTER TABLE Fornecedores ADD
	SenhaHash VARCHAR(1258);
GO
ALTER TABLE Lançamentos_Vendas ADD
	Inclusao DATETIME;
GO