import { Between, getManager, getRepository, IsNull, Raw } from 'typeorm';
import config from '../config';
import Lancamento, { LancamentoSituacaoConstantes } from '../models/lancamento';
import { LancamentoSituacaoIntegracaoConstantes } from '../models/lancamentosituacao';
import VendaHelper from '../common/funcoes';
import Cliente from '../models/cliente';
import LancamentoComplemento from '../models/lancamentocomplemento';
import LancamentoRequisicao from '../models/lancamentorequisicao';
import Conexao from '../models/conexao';
import Requisicao from '@models/requisicao';
import { execPath } from 'node:process';

class AgendamentoController {  
  async procedimentos() {
    try {      
      await getManager().query(AgendamentoController.commando());
      AgendamentoController.processa();
    } catch (error) {
      console.error(error.messagem);
    }
  }

  private static processando = false;

  static async sleep(ms: number) {
    console.log(`sleep ${ms / 1000} segundos`);
    //return new Promise(resolve => setTimeout(resolve, ms));
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < ms);
  }

  static async processa() {
    if (this.processando) {
      console.log('processamento concorrente, rejeitado');
      return 0;
    }      
    try {
      console.log(new Date());
      console.log('iniciando');
      //await this.sleep(7000);
      // verificar se a configuração de integração está ativa
      var integracoesComEntrega = config.integracoesComEntrega.join(',');    
      if (!integracoesComEntrega)
        integracoesComEntrega = '-1';
      let lancamentosPendentes = await getRepository(Lancamento).find({
        where: {
          emissao: IsNull(),
          estabelecimento: { id: config.estabelecimento.id },
          tipo: Between(22, 22), // Delivery/Encomenda
          status: Raw(alias => `(${alias} & 1) = 0`),
          id: Raw(alias => `${alias} IN (SELECT L.ID FROM Mosaico.Lancamento L JOIN Mosaico.LancamentoSituacao S ON S.LancamentoID = L.ID WHERE (L.Emissao IS NULL) AND (S.Situacao = ${LancamentoSituacaoConstantes.Pendente}) AND (S.EntregaSituacao = ${LancamentoSituacaoIntegracaoConstantes.Pendente}))`),
          integradora: Raw(alias => `ISNULL(${alias}, 0) NOT IN (${integracoesComEntrega})`),
          inclusao: Raw(alias => `DATEDIFF(SECOND, ${alias}, GETDATE()) > 3`)
        },
        relations: ['cliente']
      });
      if (lancamentosPendentes)
        console.log('Lançamentos pendentes');
      for (const lancamento of lancamentosPendentes) {
        console.log(lancamento.id, lancamento.atendimento, lancamento.cliente.nome);
        try {
          await AgendamentoController.lancamentoSituacaoEntrega(lancamento.id, LancamentoSituacaoConstantes.Pendente, LancamentoSituacaoIntegracaoConstantes.Processando);
          AgendamentoController.registra(lancamento);
        } catch {
          AgendamentoController.lancamentoSituacaoEntrega(lancamento.id, LancamentoSituacaoConstantes.Pendente, LancamentoSituacaoIntegracaoConstantes.Erro);
          return 0;
        }        
        return 1; // A sobrecarga do serviço causa timeout
      }
      let lancamentosExpedidos = await getRepository(Lancamento).find({
        where: {
          emissao: IsNull(),
          estabelecimento: { id: config.estabelecimento.id },
          tipo: Between(22, 22), // Delivery/Encomenda
          status: Raw(alias => `(${alias} & 1) = 0`),
          id: Raw(alias => `(${alias} IN (SELECT L.ID FROM Mosaico.Lancamento L JOIN Mosaico.LancamentoSituacao S ON S.LancamentoID = L.ID WHERE (L.Emissao IS NULL) AND (S.Situacao = ${LancamentoSituacaoConstantes.Expedido}) AND (S.EntregaSituacao = ${LancamentoSituacaoIntegracaoConstantes.Pendente}))) AND (${alias} IN (SELECT L.ID FROM Mosaico.Lancamento L JOIN Mosaico.LancamentoComplemento C ON C.LancamentoID = L.ID WHERE (L.Emissao IS NULL) AND (C.EntregaIntegradoraUID IS NOT NULL)))`),
          integradora: Raw(alias => `ISNULL(${alias}, 0) NOT IN (${integracoesComEntrega})`),
          inclusao: Raw(alias => `DATEDIFF(SECOND, ${alias}, GETDATE()) > 12`)
        },
        relations: ['cliente']
      });
      if (lancamentosExpedidos)
        console.log('Lançamentos expedidos');
      for (const lancamento of lancamentosExpedidos) {
        console.log(lancamento.id, lancamento.atendimento, lancamento.cliente.nome);
        try {
          await AgendamentoController.lancamentoSituacaoEntrega(lancamento.id, LancamentoSituacaoConstantes.Expedido, LancamentoSituacaoIntegracaoConstantes.Processando);
          AgendamentoController.situacaoNotifica(lancamento, LancamentoSituacaoConstantes.Expedido);
        } catch {
          AgendamentoController.lancamentoSituacaoEntrega(lancamento.id, LancamentoSituacaoConstantes.Expedido, LancamentoSituacaoIntegracaoConstantes.Erro);
          return 0;
        }        
        return 1; // A sobrecarga do serviço causa timeout
      }
      let lancamentosConcluidos = await getRepository(Lancamento).find({
        where: {
          emissao: Raw(alias => `${alias} IS NOT NULL`),
          estabelecimento: { id: config.estabelecimento.id },
          tipo: Between(22, 22), // Delivery/Encomenda
          status: Raw(alias => `(${alias} & 1) = 0`),
          id: Raw(alias => `(${alias} IN (SELECT L.ID FROM Mosaico.Lancamento L JOIN Mosaico.LancamentoSituacao S ON S.LancamentoID = L.ID WHERE (L.Emissao IS NOT NULL) AND (L.Inclusao >= (GETDATE() - 1)) AND (S.Situacao = ${LancamentoSituacaoConstantes.Encerrado}) AND (S.EntregaSituacao = ${LancamentoSituacaoIntegracaoConstantes.Pendente}))) AND (${alias} IN (SELECT L.ID FROM Mosaico.Lancamento L JOIN Mosaico.LancamentoComplemento C ON C.LancamentoID = L.ID WHERE (L.Emissao IS NOT NULL) AND (L.Inclusao >= (GETDATE() - 1)) AND (C.EntregaIntegradoraUID IS NOT NULL)))`),
          integradora: Raw(alias => `ISNULL(${alias}, 0) NOT IN (${integracoesComEntrega})`),
          inclusao: Raw(alias => `DATEDIFF(SECOND, ${alias}, GETDATE()) > 12`)
        },
        relations: ['cliente']
      });
      if (lancamentosConcluidos)
        console.log('Lançamentos encerrados');
      for (const lancamento of lancamentosConcluidos) {          
        console.log(lancamento.id, lancamento.atendimento, lancamento.cliente.nome);
        try {
          await AgendamentoController.lancamentoSituacaoEntrega(lancamento.id, LancamentoSituacaoConstantes.Encerrado, LancamentoSituacaoIntegracaoConstantes.Processando);
          AgendamentoController.situacaoNotifica(lancamento, LancamentoSituacaoConstantes.Encerrado);  
        } catch {
          AgendamentoController.lancamentoSituacaoEntrega(lancamento.id, LancamentoSituacaoConstantes.Encerrado, LancamentoSituacaoIntegracaoConstantes.Erro);
          return 0;
        }
        return 1; // A sobrecarga do serviço causa timeout
      }
      console.log('finalizando');
      return 1;
    } finally {
      this.processando = false;
    }
  }

  static async registra(lancamento: Lancamento) {
    const venda = await VendaHelper.venda(lancamento.id, true);
    const cliente = await getRepository(Cliente).findOne(lancamento.cliente.id);
    console.log('registrando',);
    let data = lancamento.inclusao.toISOString().substring(0, 19) + 'Z';
    let requisicao = await getRepository(Requisicao).findOne({
      where: { lancamento: { id: lancamento.id } },
      relations: ['integradora']
    });
    let delivery = new Delivery();    
    if (!config.foodyDelivery.token)
      console.log('token não informado');
    delivery.id = lancamento.id.toString();
    // if (
    //   requisicao
    //   && (requisicao.integradora.nome.toLowerCase() == 'ifood')
    //   && requisicao.identificador
    // ) {
    //   delivery.id = 'i' + requisicao.identificador;
    // }
    delivery.status = "open";
    delivery.notes = venda.memorando;
    delivery.date = data;
    delivery.deliveryFee = venda.frete;
    // Itens
    let valor = 0;
    let produtos: string[] = [];
    for (const item of venda.itens) {
      produtos.push(item.qde + item.produto.un + ' x ' + item.produto.nome)
      valor += item.precoTotal;
    }
    if (venda.frete)
      valor += venda.frete;
    delivery.orderDetails = produtos.join(', ');
    delivery.orderTotal = valor;
    // Pagamento
    if (venda.entrega.dinheiro)     
      delivery.paymentMethod = 'Dinheiro';
    else if (venda.entrega.cheque)
      delivery.paymentMethod = 'Cheque';
    else if (venda.entrega.pagamentoForma1)
      delivery.paymentMethod = venda.entrega.pagamentoForma1.nome;
    else if (venda.entrega.pagamentoForma2)
      delivery.paymentMethod = venda.entrega.pagamentoForma2.nome;
    else if (venda.entrega.pagamentoForma3)
      delivery.paymentMethod = venda.entrega.pagamentoForma3.nome;
    // Cliente
    delivery.customer = new Customer();
    delivery.customer.customerPhone = venda.entrega.telefones;
    delivery.customer.customerName = venda.entrega.nome;
    delivery.customer.customerEmail = cliente.email;
    // Entrega
    let endereco = '';
    endereco += venda.entrega.endereco;
    if (venda.entrega.numero)
      endereco += ', ' + venda.entrega.numero.toString();
    if (venda.entrega.bairro)
      endereco += ', ' + venda.entrega.bairro;
    delivery.deliveryPoint = new DeliveryPoint();
    delivery.deliveryPoint.address = endereco;
    delivery.deliveryPoint.city = venda.entrega.cidade;
    delivery.deliveryPoint.region = venda.entrega.uf;
    delivery.deliveryPoint.country = 'BR';
    delivery.deliveryPoint.complement = venda.entrega.complemento;
    const request = require('request');    
    const clientServerOptions = {
        uri: 'https://app.foodydelivery.com/rest/1.2/orders',
        body: JSON.stringify(delivery),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': config.foodyDelivery.token
        }
    }
    request(clientServerOptions, function (error: any, response: any) {
      let responseBody = '';
      let responseStatus = 500;
      if (response) {
        responseBody = response.body;
        responseStatus = response.statusCode;
      }      
      if (!responseBody)
        responseBody = '(no body response)';
      AgendamentoController.requisicaoGrava(
        lancamento.id,
        clientServerOptions.uri,
        clientServerOptions.method,
        clientServerOptions.body,
        responseBody,
        responseStatus        
      );
      if (error) {
        console.error('Erro:');
        console.error(error);
        AgendamentoController.lancamentoSituacaoEntrega(lancamento.id, LancamentoSituacaoConstantes.Pendente, LancamentoSituacaoIntegracaoConstantes.Erro);
        return 0;
      }
      AgendamentoController.lancamentoSituacaoEntrega(lancamento.id, LancamentoSituacaoConstantes.Pendente, LancamentoSituacaoIntegracaoConstantes.Confirmado);
      //console.log(response.statusCode, response.statusMessage, response.body);
      let retorno = JSON.parse(response.body);      
      if (retorno.uid) {
        console.log('registrado', 'lançamento', lancamento.id, 'cliente', delivery.customer.customerName, 'uid', retorno.uid);
        AgendamentoController.lancamentoVinculaUID(lancamento.id, retorno.uid);
        return 1;
      }
      console.error('não foi possível registrar', response.body);
      AgendamentoController.lancamentoSituacaoEntrega(lancamento.id, LancamentoSituacaoConstantes.Pendente, LancamentoSituacaoIntegracaoConstantes.Erro);
      return 0;        
    });
  }

  static async situacaoNotifica(lancamento: Lancamento, situacao: number) {
    const lancamentoComplemento = await getRepository(LancamentoComplemento).findOne({ where: { lancamento: { id: lancamento.id } } });
    if (!lancamentoComplemento)
      throw new Error(`complemento do lançamento ${lancamento.id} não encontrado`);    
    const uid = lancamentoComplemento.entregraIntegradoraUID;
    console.log('complemento', lancamento.id, 'uid', uid);
    if (!uid)
      throw new Error(`não é possível enviar, uid do lançamento ${lancamento.id} não encontrado`);
    // if (!uid) { // Se não tiver o identificador, registra
    //   await AgendamentoController.registra(lancamento);
    //   const lancamentoComplemento = await getRepository(LancamentoComplemento).findOne({ where: { lancamento: { id: lancamento.id } } });
    //   if (!lancamentoComplemento)
    //     throw new Error(`complemento do lançamento ${lancamento.id} não encontrado`);    
    //   uid = lancamentoComplemento.entregraIntegradoraUID;
    //   if (!uid)
    //     throw new Error(`não é possível enviar, uid do lançamento ${lancamento.id} não encontrado`);
    // }      
    const deliveryStatus = new DeliveryStatus();
    switch (situacao) {
      case LancamentoSituacaoConstantes.Expedido:
        deliveryStatus.status = 'ready';
        break;
      case LancamentoSituacaoConstantes.Encerrado:
        deliveryStatus.status = 'closed';
        break;
      default: throw new Error(`situação ${situacao} inválida para a integração`);
    }
    const request = require('request');
    const clientServerOptions = {
        uri: 'https://app.foodydelivery.com/rest/1.2/orders/updatestatus/' + uid,
        body: JSON.stringify(deliveryStatus),
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.foodyDelivery.token
        }
    }
    request(clientServerOptions, function (error: any, response: any) {      
      let responseBody = '';
      let responseStatus = 500;
      if (response) {
        responseBody = response.body;
        responseStatus = response.statusCode;
      }      
      if (!responseBody)
        responseBody = '(no body response)';
      AgendamentoController.requisicaoGrava(
        lancamento.id,
        clientServerOptions.uri,
        clientServerOptions.method,
        clientServerOptions.body,
        responseBody,
        responseStatus        
      );
      if (error) {
        console.error(error);
        AgendamentoController.lancamentoSituacaoEntrega(lancamento.id, situacao, LancamentoSituacaoIntegracaoConstantes.Erro);
        return 0;
      }
      AgendamentoController.lancamentoSituacaoEntrega(lancamento.id, situacao, LancamentoSituacaoIntegracaoConstantes.Confirmado);
      console.log(response.statusCode, response.statusMessage, response.body);
      return 1;
    });
  }

  static async requisicaoGrava(lancamentoid: number, recurso: string, metodo: string, requisicao: string, resposta: string, situacao: number) {
    let lancamentoRequisicao = new LancamentoRequisicao();
    lancamentoRequisicao.lancamento = await getRepository(Lancamento).findOne({ id: lancamentoid });
    if (!lancamentoRequisicao.lancamento)
      throw new Error(`lançamento ${lancamentoid} não encontrado`);
    lancamentoRequisicao.conexao = await getRepository(Conexao).findOne({ id: 0 });
    if (!lancamentoRequisicao.lancamento)
      throw new Error(`conexão ${lancamentoid} não encontrada`);
    lancamentoRequisicao.recurso = recurso;
    lancamentoRequisicao.metodo = metodo;
    lancamentoRequisicao.requisicao = requisicao;
    lancamentoRequisicao.resposta = resposta;
    lancamentoRequisicao.situacao = situacao;      
    getRepository(LancamentoRequisicao).save(lancamentoRequisicao);
  }

  static async lancamentoSituacaoEntrega(lancamentoid: number, situacao: number, situacaoIntegracao: number) {
    let s: string[] = [];
    s.push(`UPDATE Mosaico.LancamentoSituacao SET`);
    s.push(`  Edicao = GETDATE(),`);
    s.push(`  EntregaSituacao = ${situacaoIntegracao}`);
    s.push(`WHERE`);
    s.push(`  (LancamentoID = ${lancamentoid})`);
    s.push(`  AND (Situacao = ${situacao});`);
    await getManager().query(s.join('\n'));
  }

  static async lancamentoVinculaUID(lancamentoid: number, uid: string) {
    let s: string[] = [];
    s.push(`UPDATE Mosaico.LancamentoComplemento SET`);
    s.push(`  Edicao = GETDATE(),`);
    s.push(`  EntregaIntegradoraUID = '${uid}'`);
    s.push(`WHERE`);
    s.push(`  (LancamentoID = ${lancamentoid});`);
    await getManager().query(s.join('\n'));
  }

  static commando() {
    let estabelecimentoid = config.estabelecimento.id;
    let s: string[] = [];
    s.push(`INSERT INTO Mosaico.LancamentoSituacao`);
    s.push(`(`);
    s.push(`  Inclusao,`);
    s.push(`  Edicao,`);
    s.push(`  [Status],`);
    s.push(`  LancamentoID,`);
    s.push(`  ConexaoID,`);
    s.push(`  Situacao,`);
    s.push(`  Momento,`);
    s.push(`  CatracaNotificada,`);
    s.push(`  CatracaSituacao,`);
    s.push(`  CatracaTentativas,`);
    s.push(`  EntregaNotificada,`);
    s.push(`  EntregaSituacao,`);
    s.push(`  EntregaTentativas`);
    s.push(`)`);
    s.push(`SELECT`);
    s.push(`  GETDATE() Inclusao,`);
    s.push(`  GETDATE() Edicao,`);
    s.push(`  0 [Status],`);
    s.push(`  L.ID LancamentoID,`);
    s.push(`  0 ConexaoID,`);
    s.push(`  ${LancamentoSituacaoConstantes.Pendente} Situacao,`);
    s.push(`  GETDATE() Momento,`);
    s.push(`  0 CatracaNotificada,`);
    s.push(`  ${LancamentoSituacaoIntegracaoConstantes.Pendente} CatracaSituacao,`);
    s.push(`  0 CatracaTentativas,`);
    s.push(`  0 EntregaNotificada,`);
    s.push(`  ${LancamentoSituacaoIntegracaoConstantes.Pendente} EntregaSituacao,`);
    s.push(`  0 EntregaTentativas`);
    s.push(`FROM Mosaico.Lancamento L`);
    s.push(`WHERE`);
    s.push(`  (L.Emissao IS NULL)`);
    s.push(`  AND (L.EstabelecimentoID = ${estabelecimentoid})`);
    s.push(`  AND (DATEDIFF(SECOND, L.Inclusao, GETDATE()) > 3)`);
    s.push(`  AND (L.Tipo BETWEEN 16 AND 64)`);
    s.push(`  AND NOT EXISTS(SELECT * FROM Mosaico.LancamentoSituacao WHERE (LancamentoID = L.ID) AND (Situacao = ${LancamentoSituacaoConstantes.Pendente}));`);
    s.push(`INSERT INTO Mosaico.LancamentoComplemento`);
    s.push(`(`);
    s.push(`  Inclusao,`);
    s.push(`  Edicao,`);
    s.push(`  [Status],`);
    s.push(`  LancamentoID,`);
    s.push(`  ConexaoID,`);
    s.push(`  CatracaIntegradoraID,`);
    s.push(`  CatracaIntegradoraUID,`);
    s.push(`  EntregaIntegradoraID,`);
    s.push(`  EntregaIntegradoraUID`);
    s.push(`)`);
    s.push(`SELECT`);
    s.push(`  GETDATE() Inclusao,`);
    s.push(`  GETDATE() Edicao,`);
    s.push(`  0 [Status],`);
    s.push(`  L.ID LancamentoID,`);
    s.push(`  0 ConexaoID,`);
    s.push(`  NULL CatracaIntegradoraID,`);
    s.push(`  NULL CatracaIntegradoraUID,`);
    s.push(`  NULL EntregaIntegradoraID,`);
    s.push(`  NULL EntregaIntegradoraUID`);
    s.push(`FROM Mosaico.Lancamento L`);
    s.push(`WHERE`);
    s.push(`  (L.Emissao IS NULL)`);
    s.push(`  AND (L.EstabelecimentoID = ${estabelecimentoid})`);
    s.push(`  AND (DATEDIFF(SECOND, L.Inclusao, GETDATE()) > 3)`);
    s.push(`  AND (L.Tipo BETWEEN 16 AND 64)`);
    s.push(`  AND NOT EXISTS(SELECT * FROM Mosaico.LancamentoComplemento WHERE LancamentoID = L.ID);`);
    return s.join(`\n`);
  }
}

export class Delivery {
  uid: string;
  id: string;
  status: string;
  deliveryFee: number;
  paymentMethod: string;
  notes: string;
  courierFee: number;
  orderTotal: number;
  orderDetails: string;
  deliveryPoint: DeliveryPoint;
  customer: Customer;
  date: string;
}

export class Customer {
  customerPhone: string;
  customerName: string;
  customerEmail: string;
}

export class DeliveryPoint {
  address: string;
  city: string;
  region: string;
  country: string;
  complement: string;
}

export class DeliveryStatus {
  status: string;
}

export default new AgendamentoController();
