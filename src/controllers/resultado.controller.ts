import { getManager, getRepository, Raw } from 'typeorm';
import { Request, Response } from 'express';

class ResultadoController {

  static data(periodo: string): string {
    let retorno = new Date();
    if (!periodo)
      periodo = 'trimestre';
    switch (periodo.toLowerCase()) {
      case 'semana':
        retorno.setDate(retorno.getDate() - 7);
        break;
      case 'mes':
        retorno.setDate(retorno.getDate() - 30);
        break;
      case 'trimestre':
        retorno.setDate(retorno.getDate() - 90);
        break;  
      case 'ano':
        retorno.setDate(retorno.getDate() - 365);
        break;    
    }
    return retorno.toISOString().substring(0, 10);
  }

  async cliente(req: Request, res: Response) {
    try {
      let { vendedorid } = req.query;
      if (!vendedorid) { vendedorid = '-1'; }
      let s: string[] = [];
      s.push('SELECT TOP 10 C.id clienteid, C.nome clientenome, C.cnpj, COUNT(DISTINCT L.ID) quantidade, SUM(L.Total) total');
      s.push('FROM');
      s.push('  Mosaico.Lancamento L');
      s.push('  JOIN Mosaico.Pessoa V ON V.ID = L.VendedorID');
      s.push('  JOIN Mosaico.Cliente C ON C.ID = L.ClienteID');
      s.push('WHERE');
      s.push('  (L.VendedorID = ' + vendedorid.toString() + ')');
      s.push('  AND (L.Emissao IS NOT NULL)');
      s.push('  AND (L.Tipo BETWEEN 16 AND 64)');
      s.push('  AND ((L.Status & 1) = 0)');
      s.push('GROUP BY C.ID, C.Nome, C.CNPJ');
      s.push('ORDER BY SUM(L.Total) DESC;');
      let retorno = await getManager().query(s.join('\n'));
      // Retorna
      return res.status(201).json(retorno);      
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async clienteAusente(req: Request, res: Response) {
    try {
      let { vendedorid, periodo } = req.query;
      if (!vendedorid)
        vendedorid = '-1';
      if (!periodo)
        periodo = 'mes';
      let inicio = ResultadoController.data(periodo.toString());
      let s: string[] = [];
      s.push(`SELECT C.ID clienteid, C.Nome clientenome, X.ultimavenda, X.ultimovalor`);
      s.push(`FROM`);
      s.push(`  Mosaico.Cliente C`);
      s.push(`  CROSS APPLY`);
      s.push(`  (`);
      s.push(`    SELECT TOP 1 Inclusao UltimaVenda, Total UltimoValor`);
      s.push(`    FROM Mosaico.Lancamento`);
      s.push(`    WHERE`);
      s.push(`      (ClienteID = C.ID)`);
      s.push(`      AND (Tipo BETWEEN 16 AND 64)`);
      s.push(`    ORDER BY Inclusao DESC`);
      s.push(`  ) X`);
      s.push(`WHERE`);
      s.push(`  (C.VendedorID = ` + vendedorid.toString() + `)`);
      s.push(`  AND (C.Ativo = 1)`);
      s.push(`  AND (ISNULL(X.UltimaVenda, '2001-01-01') < '${inicio}')`);
      s.push(`ORDER BY C.Nome;`);
      let retorno = await getManager().query(s.join('\n'));
      // Retorna
      return res.status(201).json(retorno);      
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async clienteInadimplente(req: Request, res: Response) {
    try {
      let { vendedorid, periodo } = req.query;
      if (!vendedorid)
        vendedorid = '-1';
      if (!periodo)
        periodo = 'mes';
      let s: string[] = [];
      s.push(`SELECT C.id clienteid, C.nome clientenome, L.id lancamentoid, L.emissao, L.nfe, o.vencimento, o.valor`);
      s.push(`FROM`);
      s.push(`  Mosaico.Cliente C`);
      s.push(`  JOIN Mosaico.Lancamento L ON L.ClienteID = C.ID`);
      s.push(`  JOIN Mosaico.Conta O ON O.LancamentoID = L.ID`);
      s.push(`WHERE`);
      s.push(`  (C.VendedorID = ` + vendedorid.toString() + `)`);
      s.push(`  AND (C.Ativo = 1)`);
      s.push(`  AND (O.Natureza = +1)`);
      s.push(`  AND (O.Vencimento < CONVERT(DATE, GETDATE()))`);
      s.push(`ORDER BY C.Nome;`);
      let retorno = await getManager().query(s.join('\n'));
      // Retorna
      return res.status(201).json(retorno);      
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }


  async venda(req: Request, res: Response) {
    /*
      pass the date with iso format 'yyyy-mm-dd'
      const date = new Date();
      http.get(`url/test?date=${date.toISOString()}`
      in the express side
      app.get(/test', async function(req, res) {const dateInServer = newDate(req.query.date);});
    */   
    try {
      let { vendedorid, clienteid, periodo } = req.query;
      if (!vendedorid)
        vendedorid = '-1';
      if (!clienteid)
        clienteid = '';
      if (!periodo)
        periodo = '';
      let inicio = ResultadoController.data(periodo.toString());
      let s: string[] = [];
      s.push(`SELECT L.id, C.id clienteid, C.nome clientenome, L.emissao, L.total`);
      s.push(`FROM`);
      s.push(`  Mosaico.Lancamento L`);
      s.push(`  JOIN Mosaico.Pessoa V ON V.ID = L.VendedorID`);
      s.push(`  JOIN Mosaico.Cliente C ON C.ID = L.ClienteID`);
      s.push(`WHERE`);
      s.push(`  (L.VendedorID = ` + vendedorid.toString() + `)`);
      if (clienteid)
        s.push(`  AND (L.ClienteID = ` + clienteid.toString() + `)`);
      else
        s.push(`  AND (L.ClienteID > 0)`);
      s.push(`  AND (L.Emissao >= '${inicio}')`);
      s.push(`  AND (L.Tipo BETWEEN 16 AND 64)`);
      s.push(`  AND ((L.Status & 1) = 0)`);
      s.push(`ORDER BY L.Emissao DESC;`);
      let retorno = await getManager().query(s.join('\n'));
      // Retorna
      return res.status(201).json(retorno);      
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async produto(req: Request, res: Response) {
    try {
      let { vendedorid } = req.query;
      if (!vendedorid) { vendedorid = '-1'; }
      let s: string[] = [];
      s.push('SELECT TOP 20 D.id produtoid, D.Nome produtonome, SUM(R.QDE) quantidade, SUM(R.PrecoTotal) total');
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
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async emissao(req: Request, res: Response) {
    try {
      let { vendedorid } = req.query;
      if (!vendedorid) { vendedorid = '-1'; }
      let s: string[] = [];
      s.push('SELECT CONVERT(DATE, L.Emissao) emissao, SUM(L.Total) total');
      s.push('FROM Mosaico.Lancamento L');
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
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new ResultadoController();