import { Router } from 'express';
import authMiddleware from './middlewares/autenticacao.middleware';
import UsuarioController from './controllers/usuario.controller';
import AutenticacaoController from './controllers/autorizacao.controller';
import AgendamentoController from './controllers/agendamento.controller';
import CategoriaController from './controllers/categoria.controller';
import ProdutoController from './controllers/produto.controller';
import EstabelecimentoController from './controllers/estabelecimento.controller';
import PrecoController from './controllers/preco.controller';
import DepartamentoController from './controllers/departamento.controller';
import HistoricoController from './controllers/historico.controller';
import PagamentoFormaController from './controllers/pagamentoforma.controller';
import PagamentoPlanoController from './controllers/pagamentoplano.controller';
import ClienteTipoController from './controllers/clientetipo.controller';
import UFController from './controllers/uf.controller';
import MunicipioController from './controllers/municipio.controller';
import ClienteController from './controllers/cliente.controller';
import PessoaController from './controllers/pessoa.controller';
import FilaController from './controllers/fila.controller';
import LancamentoController from './controllers/lancamento.controller';
import VendaController from './controllers/venda.controller';
import OperacaoController from './controllers/operacao.controller';
import NaturezaOperacaoController from './controllers/naturezaoperacao.controller';
import ResultadoController from './controllers/resultado.controller';

const router = Router();
const enderecoAPI = process.env.ADDRESS_API;

router.post(`${enderecoAPI}/autenticacao`, AutenticacaoController.autentica);
router.get(`${enderecoAPI}/procedimentos`, AgendamentoController.procedimentox);
router.post(`${enderecoAPI}/usuarios/novo`, authMiddleware, UsuarioController.grava);
router.get(`${enderecoAPI}/usuarios`, authMiddleware, UsuarioController.lista);
router.get(`${enderecoAPI}/usuarios/:id`, authMiddleware, UsuarioController.buscaPorId);
router.get(`${enderecoAPI}/categorias`, authMiddleware, CategoriaController.lista);
router.get(`${enderecoAPI}/categorias/:id`, authMiddleware, CategoriaController.buscaPorId);
router.get(`${enderecoAPI}/produtos`, authMiddleware, ProdutoController.lista);
router.get(`${enderecoAPI}/produtos/:id`, authMiddleware, ProdutoController.buscaPorId);
router.get(`${enderecoAPI}/estabelecimentos`, authMiddleware, EstabelecimentoController.lista);
router.get(`${enderecoAPI}/estabelecimentos/:id`, authMiddleware, EstabelecimentoController.buscaPorId);
router.get(`${enderecoAPI}/precos`, authMiddleware, PrecoController.lista);
router.get(`${enderecoAPI}/precos/:id`, authMiddleware, PrecoController.buscaPorId);
router.get(`${enderecoAPI}/departamentos`, authMiddleware, DepartamentoController.lista);
router.get(`${enderecoAPI}/departamentos/:id`, authMiddleware, DepartamentoController.buscaPorId);
router.get(`${enderecoAPI}/historicos`, authMiddleware, HistoricoController.lista);
router.get(`${enderecoAPI}/historicos/:id`, authMiddleware, HistoricoController.buscaPorId);
router.get(`${enderecoAPI}/pagamentoformas`, authMiddleware, PagamentoFormaController.lista);
router.get(`${enderecoAPI}/pagamentoformas/:id`, authMiddleware, PagamentoFormaController.buscaPorId);
router.get(`${enderecoAPI}/pagamentoplanos`, authMiddleware, PagamentoPlanoController.lista);
router.get(`${enderecoAPI}/pagamentoplanos/:id`, authMiddleware, PagamentoPlanoController.buscaPorId);
router.get(`${enderecoAPI}/clientetipos`, authMiddleware, ClienteTipoController.lista);
router.get(`${enderecoAPI}/clientetipos/:id`, authMiddleware, ClienteTipoController.buscaPorId);
router.get(`${enderecoAPI}/ufs`, authMiddleware, UFController.lista);
router.get(`${enderecoAPI}/ufs/:id`, authMiddleware, UFController.buscaPorId);
router.get(`${enderecoAPI}/municipios/:ufid/uf`, authMiddleware, MunicipioController.lista);
router.get(`${enderecoAPI}/municipios/:id`, authMiddleware, MunicipioController.buscaPorId);
router.get(`${enderecoAPI}/clientes`, authMiddleware, ClienteController.lista);
router.get(`${enderecoAPI}/clientes/:id`, authMiddleware, ClienteController.buscaPorId);
router.post(`${enderecoAPI}/clientes/grava`, authMiddleware, ClienteController.grava);
router.get(`${enderecoAPI}/pessoas`, authMiddleware, PessoaController.lista);
router.get(`${enderecoAPI}/pessoas/:id`, authMiddleware, PessoaController.buscaPorId);
router.post(`${enderecoAPI}/pessoas/grava`, authMiddleware, PessoaController.grava);
router.get(`${enderecoAPI}/filas`, authMiddleware, FilaController.lista);
router.get(`${enderecoAPI}/filas/:id`, authMiddleware, FilaController.buscaPorId);
router.post(`${enderecoAPI}/filas/grava`, authMiddleware, FilaController.grava);
router.get(`${enderecoAPI}/lancamentos`, authMiddleware, LancamentoController.lista);
router.get(`${enderecoAPI}/lancamentos/:id`, authMiddleware, LancamentoController.buscaPorId);
router.post(`${enderecoAPI}/lancamentos/grava`, authMiddleware, LancamentoController.grava);
router.get(`${enderecoAPI}/vendas`, authMiddleware, VendaController.lista);
router.get(`${enderecoAPI}/vendas/:id`, authMiddleware, VendaController.buscaPorId);
router.get(`${enderecoAPI}/operacoes`, authMiddleware, OperacaoController.lista);
router.get(`${enderecoAPI}/operacoes/:id`, authMiddleware, OperacaoController.buscaPorId);
router.get(`${enderecoAPI}/naturezaoperacoes`, authMiddleware, NaturezaOperacaoController.lista);
router.get(`${enderecoAPI}/naturezaoperacoes/:id`, authMiddleware, NaturezaOperacaoController.buscaPorId);
router.post(`${enderecoAPI}/vendas/grava`, authMiddleware, VendaController.grava);
router.delete(`${enderecoAPI}/vendas/:id`, authMiddleware, VendaController.exclui);
router.get(`${enderecoAPI}/resultado/cliente`, authMiddleware, ResultadoController.cliente);
router.get(`${enderecoAPI}/resultado/produto`, authMiddleware, ResultadoController.produto);
router.get(`${enderecoAPI}/resultado/emissao`, authMiddleware, ResultadoController.emissao);

export default router;

