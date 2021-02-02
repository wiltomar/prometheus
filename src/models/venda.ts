import Cliente from './cliente';
import Departamento from './departamento';
import Estabelecimento from './estabelecimento';
import Historico from './historico';
import PagamentoForma from './pagamentoforma';
import PagamentoPlano from './pagamentoplano';
import Pedido from './pedido';
import Produto from './produto';

// Wiltomar
export class VendaItem {    
    id: number;
    item: number;
    produto: Produto;
    qde: number;
    preco: number;
    precoTotal: number;
    observacao: string;
}

export class VendaPagamento {    
    id: number;
    sp: number;
    pagamentoPlano: PagamentoPlano;
    pagamentoForma: PagamentoForma;
    parcelas: number;
    valor: number;
}

export class Venda {
    id: number;
    situacao: string;
    historico: Historico;
    estabelecimento: Estabelecimento;
    departamento: Departamento;
    tipo: number;
    cliente: Cliente;
    emissao: Date;
    pedido: Pedido;
    subtotal: number;
    desconto: number;
    frete: number;
    total: number;
    memorando: string;
    itens: VendaItem[];
    pagamentos: VendaPagamento[];    
}