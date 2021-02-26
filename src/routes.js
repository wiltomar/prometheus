"use strict";
exports.__esModule = true;
var express_1 = require("express");
var autenticacao_middleware_1 = require("./middlewares/autenticacao.middleware");
var usuario_controller_1 = require("@controllers/usuario.controller");
var autorizacao_controller_1 = require("@controllers/autorizacao.controller");
var categoria_controller_1 = require("@controllers/categoria.controller");
var produto_controller_1 = require("@controllers/produto.controller");
var estabelecimento_controller_1 = require("@controllers/estabelecimento.controller");
var preco_controller_1 = require("@controllers/preco.controller");
var departamento_controller_1 = require("@controllers/departamento.controller");
var historico_controller_1 = require("@controllers/historico.controller");
var pagamentoforma_controller_1 = require("@controllers/pagamentoforma.controller");
var pagamentoplano_controller_1 = require("@controllers/pagamentoplano.controller");
var clientetipo_controller_1 = require("@controllers/clientetipo.controller");
var uf_controller_1 = require("@controllers/uf.controller");
var municipio_controller_1 = require("@controllers/municipio.controller");
var cliente_controller_1 = require("@controllers/cliente.controller");
var pessoa_controller_1 = require("@controllers/pessoa.controller");
var fila_controller_1 = require("@controllers/fila.controller");
var lancamento_controller_1 = require("@controllers/lancamento.controller");
var venda_controller_1 = require("@controllers/venda.controller");
var router = express_1.Router();
var enderecoAPI = process.env.ADDRESS_API;
router.post(enderecoAPI + "/autenticacao", autorizacao_controller_1["default"].autentica);
router.post(enderecoAPI + "/usuarios/novo", autenticacao_middleware_1["default"], usuario_controller_1["default"].grava);
router.get(enderecoAPI + "/usuarios", autenticacao_middleware_1["default"], usuario_controller_1["default"].lista);
router.get(enderecoAPI + "/usuarios/:id", autenticacao_middleware_1["default"], usuario_controller_1["default"].buscaPorId);
router.get(enderecoAPI + "/categorias", autenticacao_middleware_1["default"], categoria_controller_1["default"].lista);
router.get(enderecoAPI + "/categorias/:id", autenticacao_middleware_1["default"], categoria_controller_1["default"].buscaPorId);
router.get(enderecoAPI + "/produtos", autenticacao_middleware_1["default"], produto_controller_1["default"].lista);
router.get(enderecoAPI + "/produtos/:id", autenticacao_middleware_1["default"], produto_controller_1["default"].buscaPorId);
router.get(enderecoAPI + "/estabelecimentos", autenticacao_middleware_1["default"], estabelecimento_controller_1["default"].lista);
router.get(enderecoAPI + "/estabelecimentos/:id", autenticacao_middleware_1["default"], estabelecimento_controller_1["default"].buscaPorId);
router.get(enderecoAPI + "/precos", autenticacao_middleware_1["default"], preco_controller_1["default"].lista);
router.get(enderecoAPI + "/precos/:id", autenticacao_middleware_1["default"], preco_controller_1["default"].buscaPorId);
router.get(enderecoAPI + "/departamentos", autenticacao_middleware_1["default"], departamento_controller_1["default"].lista);
router.get(enderecoAPI + "/departamentos/:id", autenticacao_middleware_1["default"], departamento_controller_1["default"].buscaPorId);
router.get(enderecoAPI + "/historicos", autenticacao_middleware_1["default"], historico_controller_1["default"].lista);
router.get(enderecoAPI + "/historicos/:id", autenticacao_middleware_1["default"], historico_controller_1["default"].buscaPorId);
router.get(enderecoAPI + "/pagamentoformas", autenticacao_middleware_1["default"], pagamentoforma_controller_1["default"].lista);
router.get(enderecoAPI + "/pagamentoformas/:id", autenticacao_middleware_1["default"], pagamentoforma_controller_1["default"].buscaPorId);
router.get(enderecoAPI + "/pagamentoplanos", autenticacao_middleware_1["default"], pagamentoplano_controller_1["default"].lista);
router.get(enderecoAPI + "/pagamentoplanos/:id", autenticacao_middleware_1["default"], pagamentoplano_controller_1["default"].buscaPorId);
router.get(enderecoAPI + "/clientetipos", autenticacao_middleware_1["default"], clientetipo_controller_1["default"].lista);
router.get(enderecoAPI + "/clientetipos/:id", autenticacao_middleware_1["default"], clientetipo_controller_1["default"].buscaPorId);
router.get(enderecoAPI + "/ufs", autenticacao_middleware_1["default"], uf_controller_1["default"].lista);
router.get(enderecoAPI + "/ufs/:id", autenticacao_middleware_1["default"], uf_controller_1["default"].buscaPorId);
router.get(enderecoAPI + "/municipios/:ufid/uf", autenticacao_middleware_1["default"], municipio_controller_1["default"].lista);
router.get(enderecoAPI + "/municipios/:id", autenticacao_middleware_1["default"], municipio_controller_1["default"].buscaPorId);
router.get(enderecoAPI + "/clientes", autenticacao_middleware_1["default"], cliente_controller_1["default"].lista);
router.get(enderecoAPI + "/clientes/:id", autenticacao_middleware_1["default"], cliente_controller_1["default"].buscaPorId);
router.post(enderecoAPI + "/clientes/grava", autenticacao_middleware_1["default"], cliente_controller_1["default"].grava);
router.get(enderecoAPI + "/pessoas", autenticacao_middleware_1["default"], pessoa_controller_1["default"].lista);
router.get(enderecoAPI + "/pessoas/:id", autenticacao_middleware_1["default"], pessoa_controller_1["default"].buscaPorId);
router.post(enderecoAPI + "/pessoas/grava", autenticacao_middleware_1["default"], pessoa_controller_1["default"].grava);
router.get(enderecoAPI + "/filas", autenticacao_middleware_1["default"], fila_controller_1["default"].lista);
router.get(enderecoAPI + "/filas/:id", autenticacao_middleware_1["default"], fila_controller_1["default"].buscaPorId);
router.post(enderecoAPI + "/filas/grava", autenticacao_middleware_1["default"], fila_controller_1["default"].grava);
router.get(enderecoAPI + "/lancamentos", autenticacao_middleware_1["default"], lancamento_controller_1["default"].lista);
router.get(enderecoAPI + "/lancamentos/:id", autenticacao_middleware_1["default"], lancamento_controller_1["default"].buscaPorId);
router.post(enderecoAPI + "/lancamentos/grava", autenticacao_middleware_1["default"], lancamento_controller_1["default"].grava);
router.get(enderecoAPI + "/vendas", autenticacao_middleware_1["default"], venda_controller_1["default"].lista);
router.get(enderecoAPI + "/vendas/:id", autenticacao_middleware_1["default"], venda_controller_1["default"].buscaPorId);
router.post(enderecoAPI + "/vendas/grava", autenticacao_middleware_1["default"], venda_controller_1["default"].grava);
router["delete"](enderecoAPI + "/vendas/:id", autenticacao_middleware_1["default"], venda_controller_1["default"].exclui);
exports["default"] = router;