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

export class VendaItem {    
    id: number;
    pedido: Pedido;
    item: number;
    departamento: DepartamentoR;
    produto: ProdutoR;
    qde: number;
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
    memorando: string;
    vendedor: VendedorR;
    itens: VendaItem[];
    pagamentos: VendaPagamento[];    
}