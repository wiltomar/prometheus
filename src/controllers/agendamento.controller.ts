import Lancamento from '@models/lancamento';
import { Between, getManager, getRepository, IsNull, Raw } from 'typeorm';

class AgendamentoController {  
  async procedimentos() {
    try {
      getManager()
        .query(AgendamentoController
          .commando()).then(() => { AgendamentoController.finaliza(); });
    } catch (error) {
      console.error(error.messagem);
    }
  }

  static async finaliza() {
    // verificar se a configuração de integração está ativa 
    console.log('iniciando'); //complemento: { catracaIntegradoraUID: IsNull() }, 
    let lancamentos = await getRepository(Lancamento).find({
      where: {
        emissao: IsNull(),
        tipo: Between(22, 23), // Delivery/Encomenda
        status: Raw(alias => `(${alias} & 1) = 0`),
        id: Raw(alias => `${alias} IN (SELECT L.ID FROM Mosaico.Lancamento L JOIN Mosaico.LancamentoSituacao S ON S.LancamentoID = L.ID WHERE (L.Emissao IS NULL) AND (S.Situacao = 0) AND (S.EntregaNotificada = 0))`)
      },
      relations: ['cliente']
    });
    for (const lancamento of lancamentos) {
        console.log(lancamento.id, lancamento.atendimento, lancamento.cliente.nome);
        AgendamentoController.registra(lancamento);
    }
    console.log('finalizando');
    return 1;
  }

  static registra(lancamento: Lancamento) {
    var request = require('request');
    var clientServerOptions = {
        uri: 'https://app.foodydelivery.com/rest/1.2/orders',
        body: JSON.stringify({ model: 'yerich' }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    request(clientServerOptions, function (error: any, response: { body: any; }) {
        console.log(error, response.body);
        return;
    });
  }

  static commando() {
    let s: string[] = [];
    s.push('INSERT INTO Mosaico.LancamentoSituacao');
    s.push('(');
    s.push('  Inclusao,');
    s.push('  Edicao,');
    s.push('  [Status],');
    s.push('  LancamentoID,');
    s.push('  ConexaoID,');
    s.push('  Situacao,');
    s.push('  Momento,');
    s.push('  CatracaNotificada,');
    s.push('  CatracaSituacao,');
    s.push('  CatracaTentativas,');
    s.push('  EntregaNotificada,');
    s.push('  EntregaSituacao,');
    s.push('  EntregaTentativas');
    s.push(')');
    s.push('SELECT');
    s.push('  GETDATE() Inclusao,');
    s.push('  GETDATE() Edicao,');
    s.push('  0 [Status],');
    s.push('  L.ID LancamentoID,');
    s.push('  0 ConexaoID,');
    s.push('  0 Situacao,');
    s.push('  GETDATE() Momento,');
    s.push('  0 CatracaNotificada,');
    s.push('  0 CatracaSituacao,');
    s.push('  0 CatracaTentativas,');
    s.push('  0 EntregaNotificada,');
    s.push('  0 EntregaSituacao,');
    s.push('  0 EntregaTentativas');
    s.push('FROM Mosaico.Lancamento L');
    s.push('WHERE');
    s.push('  (L.Emissao IS NULL)');
    s.push('  AND (DATEDIFF(SECOND, L.Inclusao, GETDATE()) > 3)');
    s.push('  AND (L.Tipo BETWEEN 16 AND 64)');
    s.push('  AND NOT EXISTS(SELECT * FROM Mosaico.LancamentoSituacao WHERE (LancamentoID = L.ID) AND (Situacao = 0));');
    s.push('INSERT INTO Mosaico.LancamentoComplemento');
    s.push('(');
    s.push('  Inclusao,');
    s.push('  Edicao,');
    s.push('  [Status],');
    s.push('  LancamentoID,');
    s.push('  ConexaoID,');
    s.push('  CatracaIntegradoraID,');
    s.push('  CatracaIntegradoraUID,');
    s.push('  EntregaIntegradoraID,');
    s.push('  EntregaIntegradoraUID');
    s.push(')');
    s.push('SELECT');
    s.push('  GETDATE() Inclusao,');
    s.push('  GETDATE() Edicao,');
    s.push('  0 [Status],');
    s.push('  L.ID LancamentoID,');
    s.push('  0 ConexaoID,');
    s.push('  NULL CatracaIntegradoraID,');
    s.push('  NULL CatracaIntegradoraUID,');
    s.push('  NULL EntregaIntegradoraID,');
    s.push('  NULL EntregaIntegradoraUID');
    s.push('FROM Mosaico.Lancamento L');
    s.push('WHERE');
    s.push('  (L.Emissao IS NULL)');
    s.push('  AND (DATEDIFF(SECOND, L.Inclusao, GETDATE()) > 3)');
    s.push('  AND (L.Tipo BETWEEN 16 AND 64)');
    s.push('  AND NOT EXISTS(SELECT * FROM Mosaico.LancamentoComplemento WHERE LancamentoID = L.ID);');
    return s.join('\n');
  }
}

export default new AgendamentoController();
