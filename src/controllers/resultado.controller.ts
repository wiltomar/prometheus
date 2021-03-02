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
      s.push('WHERE L.VendedorID = ' + vendedorid.toString());
      s.push('GROUP BY C.ID, C.Nome');
      s.push('ORDER BY SUM(L.Total) DESC;');
      let retorno = await getManager().query(s.join('\n'));
      // Retorna
      return res.status(201).json(retorno);      
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new ResultadoController();
