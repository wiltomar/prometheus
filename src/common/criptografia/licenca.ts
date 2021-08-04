import Autorizacao from "../../models/autorizacao";
import { getRepository } from "typeorm";
import { Criptografia } from "./criptografia";

export class Licenca {

    id: number = 0;
    nome: string = '';
    apiIntegracaoPreVenda: number = 0;
    apiIntegracaoBalcao: number = 0;
    apiIntegracaoMesa: number = 0;
    apiIntegracaoCartao: number = 0;
    apiIntegracaoDelivery: number = 0;
    apiIntegracaoEncomenda: number = 0;
    apiIntegracaoFoodyDelivery: number = 0;

    naoHabilitado(integracao: string) {
        throw new Error(`integração ${integracao} não habilitada na licença`);
    }

    verificaFoodyDelivery() {
        if (!this.apiIntegracaoFoodyDelivery)
            this.naoHabilitado('FoodyDelivery');
    }

    verificaAtendimentoMesa() {
        if (!this.apiIntegracaoMesa)
            this.naoHabilitado('Mesa');
    }

    verificaAtendimentoCartao() {
        if (!this.apiIntegracaoCartao)
            this.naoHabilitado('Cartão');
    }

}

var _infoLicenca: Licenca;

export async function infoLicenca(): Promise<Licenca> {

    if (!_infoLicenca)
        _infoLicenca = new Licenca();
    let autorizacao = await getRepository(Autorizacao).findOne(1);
    if (!autorizacao)
        throw new Error('licença não informada');
    let chave = autorizacao.licenca.substr(0, 2);
    if (chave !== '01')
        throw new Error('versão da licença incompatível');
    let conteudo = autorizacao.licenca.substr(2);        
    conteudo = Criptografia.decriptoStr(conteudo, '');
    if (conteudo) {
        chave = conteudo.substr(0, 2);
        conteudo = conteudo.substr(2);
        conteudo = Criptografia.decriptoStr(conteudo, chave);
    }
    let licencaMap = new Map();
    let chaves = conteudo.split(';');
    for (let chave of chaves) {
        let i = chave.indexOf('=');
        if (i > 0)
            licencaMap.set(chave.substr(0, i), chave.substr(i + 1));
    }
    _infoLicenca.id = +licencaMap.get('Código');
    _infoLicenca.nome = licencaMap.get('Nome');
    _infoLicenca.apiIntegracaoPreVenda = parseInt(licencaMap.get('APIIntegracaoPreVenda')) || 0;
    _infoLicenca.apiIntegracaoBalcao = parseInt(licencaMap.get('APIIntegracaoBalcao')) || 0;
    _infoLicenca.apiIntegracaoMesa = parseInt(licencaMap.get('APIIntegracaoMesa')) || 0;
    _infoLicenca.apiIntegracaoCartao = parseInt(licencaMap.get('APIIntegracaoCartao')) || 0;
    _infoLicenca.apiIntegracaoDelivery = parseInt(licencaMap.get('APIIntegracaoDelivery')) || 0;
    _infoLicenca.apiIntegracaoEncomenda = parseInt(licencaMap.get('APIIntegracaoEncomenda')) || 0;
    _infoLicenca.apiIntegracaoFoodyDelivery = parseInt(licencaMap.get('APIIntegracaoFoodDelivery')) || 0;   
    //console.log('licenca', _infoLicenca);
    return _infoLicenca;

}