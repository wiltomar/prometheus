import Lancamento from "@models/lancamento";
import LancamentoPagamento from "@models/lancamentopagamento";
import Pedido from "@models/pedido";
import { Venda, VendaItem, VendaPagamento } from "@models/venda";
import { EntityManager, getManager, getRepository } from "typeorm";

class VendaHelper {
    constructor() {
      // set props normally
      // nothing async can go here
    }
    public static async venda(id: number, completo: Boolean): Promise<Venda> {
        // do your async stuff here      
        // now instantiate and return a class
        let lancamento = await getRepository(Lancamento).findOne(
            {
                where: { id: id },
                relations: ['conexao', 'estabelecimento', 'historico', 'cliente']
            }
        );
        if (!lancamento) {
            return null;
        }
        if (!(lancamento.tipo >= 16) && (64 <= lancamento.tipo))
            throw new Error("Lançamento não é uma venda");
        let retorno: Venda = new Venda();
        retorno.id = lancamento.id;
        retorno.historico = lancamento.historico;
        retorno.estabelecimento = lancamento.estabelecimento;
        retorno.tipo = lancamento.tipo;
        retorno.cliente = lancamento.cliente;
        retorno.emissao = lancamento.emissao;
        retorno.subtotal = lancamento.subtotal;
        retorno.desconto = lancamento.desconto;
        retorno.frete = lancamento.taxaEntrega;
        retorno.total = lancamento.total;
        retorno.memorando = lancamento.memorando;
        if (!retorno.emissao)
            retorno.situacao = 'Pendente'
        else
            retorno.situacao = 'Encerrado';
        if (!completo)
            return retorno;
        let pedidos = await getRepository(Pedido).find(
            {
                where: { lancamento: { id: retorno.id } },
                relations: ['conexao', 'estabelecimento', 'vendedor', 'pedidoProdutos', 'pedidoProdutos.departamento', 'pedidoProdutos.produto']
            }
        );
        if (!pedidos)
            throw new Error("Lançamento sem pedidos");
        // if (pedidos.length > 1)
        //     throw new Error("Lançamento com múltiplos pedidos");
        retorno.vendedor = pedidos[0].vendedor;
        let pagamentos = await getRepository(LancamentoPagamento).find({
            where: { lancamento: { id: retorno.id } },
            relations: ['conexao', 'pagamentoPlano', 'pagamentoForma']
        });
        // Pagamentos
        retorno.pagamentos = [];
        pagamentos.forEach(pagamento => {
            let vendaPagamento = new VendaPagamento();
            vendaPagamento.id = pagamento.id;
            vendaPagamento.sp = pagamento.sp;
            vendaPagamento.pagamentoForma = pagamento.pagamentoForma;
            vendaPagamento.pagamentoPlano = pagamento.pagamentoPlano;
            vendaPagamento.parcelas = pagamento.parcelas;
            vendaPagamento.valor = pagamento.valor;
            retorno.pagamentos.push(vendaPagamento);
        });
        // Itens
        retorno.itens = [];
        pedidos.forEach(pedido => {
            pedido.pedidoProdutos.forEach(pedidoProduto => {
                let vendaItem = new VendaItem();
                vendaItem.id = pedidoProduto.id;
                vendaItem.pedido = pedidoProduto.pedido;
                vendaItem.item = pedidoProduto.item;
                vendaItem.departamento = pedidoProduto.departamento;
                vendaItem.produto = pedidoProduto.produto;
                vendaItem.qde = pedidoProduto.qde;
                vendaItem.preco = pedidoProduto.preco;
                vendaItem.precoTotal = pedidoProduto.precoTotal;
                vendaItem.observacao = pedidoProduto.observacoes;
                retorno.itens.push(vendaItem);
            });
        });
        return retorno;
    }
  }

  export default VendaHelper;