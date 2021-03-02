import { getManager, getRepository, Raw } from 'typeorm';
import { Request, Response } from 'express';

class ResultadoController {
  async cliente(req: Request, res: Response) {
    try {
      let { vendedorid } = req.query;
      if (!vendedorid) { vendedorid = '-1'; }
      let s: string[] = [];
      s.push('SELECT TOP 10 C.ID clienteid, C.Nome clientenome, COUNT(DISTINCT L.ID) quantidade, SUM(L.Total) total');
      s.push('FROM');
      s.push('  Mosaico.Lancamento L');
      s.push('  JOIN Mosaico.Pessoa V ON V.ID = L.VendedorID');
      s.push('  JOIN Mosaico.Cliente C ON C.ID = L.ClienteID');
      s.push('WHERE');
      s.push('  (L.VendedorID = ' + vendedorid.toString() + ')');
      s.push('  AND (L.Emissao IS NOT NULL)');
      s.push('  AND (L.Tipo BETWEEN 16 AND 64)');
      s.push('  AND ((L.Status & 1) = 0)');
      s.push('GROUP BY C.ID, C.Nome');
      s.push('ORDER BY SUM(L.Total) DESC;');
      let retorno = await getManager().query(s.join('\n'));
      // Retorna
      return res.status(201).json(retorno);      
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async produto(req: Request, res: Response) {
    try {
      let { vendedorid } = req.query;
      if (!vendedorid) { vendedorid = '-1'; }
      let s: string[] = [];
      s.push('SELECT TOP 20 D.ID produtoid, D.Nome produtonome, SUM(R.QDE) quantidade, SUM(R.PrecoTotal) total');
      s.push('FROM');
      s.push('  Mosaico.Lancamento L');
      s.push('  JOIN Mosaico.Pedido P ON P.LancamentoID = L.ID');
      s.push('  JOIN Mosaico.PedidoProduto R ON R.PedidoID = P.ID');
      s.push('  JOIN Mosaico.Produto D ON D.ID = R.ProdutoID');
      s.push('WHERE');
      s.push('  (L.VendedorID = ' + vendedorid.toString() + ')');
      s.push('  AND (L.Emissao IS NOT NULL)');
      s.push('  AND (L.Tipo BETWEEN 16 AND 64)');
      s.push('  AND ((L.Status & 1) = 0)');
      s.push('  AND (P.Natureza = -1)');
      s.push('  AND (R.Fator <> 0)');
      s.push('GROUP BY D.ID, D.Nome');
      s.push('ORDER BY SUM(R.PrecoTotal) DESC;');
      let retorno = await getManager().query(s.join('\n'));
      // Retorna
      return res.status(201).json(retorno);      
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async emissao(req: Request, res: Response) {
    try {
      let { vendedorid } = req.query;
      if (!vendedorid) { vendedorid = '-1'; }
      let s: string[] = [];
      s.push('SELECT CONVERT(DATE, L.Emissao) emissao, SUM(L.Total) total');
      s.push('  FROM Mosaico.Lancamento L');
      s.push('WHERE');
      s.push('  (L.VendedorID = ' + vendedorid.toString() + ')');
      s.push('  AND (L.Emissao >= CONVERT(DATE, GETDATE() - 15))');
      s.push('  AND (L.Tipo BETWEEN 16 AND 64)');
      s.push('  AND ((L.Status & 1) = 0)');
      s.push('GROUP BY CONVERT(DATE, L.Emissao)');
      s.push('ORDER BY 1;');
      let retorno = await getManager().query(s.join('\n'));
      // Retorna
      return res.status(201).json(retorno);      
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new ResultadoController();