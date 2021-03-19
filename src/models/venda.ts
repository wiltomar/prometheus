import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EstabelecimentoR } from './estabelecimento';
import { DepartamentoR } from './departamento';
import { ClienteR } from './cliente';
import { HistoricoR } from './historico';
import { ProdutoR } from './produto';
import { VendedorR } from './vendedor';
import { PagamentoPlanoR } from './pagamentoplano';
import { PagamentoFormaR } from './pagamentoforma';
import Pedido from './pedido';
import Operacao from './operacao';
import NaturezaOperacao from './naturezaoperacao';

@Entity('lançamentos')
export class Venda {
    @PrimaryGeneratedColumn('increment')
    id: number;
    situacao: string;
    historico: HistoricoR;
    estabelecimento: EstabelecimentoR;
    tipo: number;
    cliente: ClienteR;
    emissao: Date;
    pedido: Pedido;
    subtotal: number;
    desconto: number;
    frete: number;
    total: number;
    modelo: string;
    memorando: string;
    operacao: Operacao;
    // naturezaOperacao: NaturezaOperacao;
    vendedor: VendedorR;
    entrega: VendaEntrega;
    itens: VendaItem[];
    pagamentos: VendaPagamento[];
}

export class VendaItem {    
    id: number;
    pedido: Pedido;
    item: number;
    departamento: DepartamentoR;
    produto: ProdutoR;
    qde: number;
    desconto: number;
    descontoPercentual: number;
    preco: number;
    precoTotal: number;
    observacao: string;
}

export class VendaPagamento {    
    id: number;
    sp: number;
    pagamentoPlano: PagamentoPlanoR;
    pagamentoForma: PagamentoFormaR;
    parcelas: number;
    valor: number;
}

export class VendaEntrega {    
    nome: string;
    cep: string;
    endereco: string;
    numero: number;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    referencia: string;
    telefones: string;
    celulares: string;
    dinheiro: number;
    cheque: number;    
    pagamentoForma1: PagamentoFormaR;
    valor1: number;
    pagamentoForma2: PagamentoFormaR;
    valor2: number;
    pagamentoForma3: PagamentoFormaR;
    valor3: number;
}