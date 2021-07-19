IF (OBJECT_ID('Mosaico.LancamentoVenda') IS NOT NULL)
	DROP VIEW Mosaico.LancamentoVenda;
GO
CREATE VIEW Mosaico.LancamentoVenda AS
SELECT LancamentoID ID, Inclusao, Edicao, Status, Bloqueado, Credito, SequencialDiario, VendedorID, CorretorID, CorretorComissao, CorretorBonus, EntregadorID, FreteID TaxaDeEntregaID, FreteItem, TaxaDeServicoID, TaxaDeServicoItem, Homens, Mulheres, Criancas, Dinheiro, Cheque, Protocolo, FormaDePagamento1, Valor1, Cartao1Numero, Cartao1Validade, Cartao1CS, FormaDePagamento2, Valor2, Cartao2Numero, Cartao2Validade, Cartao2CS, FormaDePagamento3, Valor3, Cartao3Numero, Cartao3Validade, Cartao3CS, EntregaNome, EntregaCEP, EntregaEndereco, EntregaNumero, EntregaComplemento, EntregaBairro, EntregaCidade, EntregaUF, EntregaReferencia, EntregaTelefones, EntregaCelulares, EntregaSituacao, EntregaComputadorID, Envio, Consumo
FROM Lançamentos_Vendas;
GO