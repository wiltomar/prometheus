export interface Estabelecimento {
    id: number;
    nome: string;
}

export interface FoodyDelivery {
    ativo: boolean;
    token: string;
}

export interface Config
{
    estabelecimento: Estabelecimento;
    computadorId: number;
    foodyDelivery: FoodyDelivery;
    integracoesComEntrega: number[];
    impressao: boolean;
    impressaoUrl: string;
}

let config: Config = require('./config/config.json');

export default config;