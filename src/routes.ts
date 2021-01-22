import { Router } from 'express';
import UsuarioController from '@controllers/usuario.controller';
import AutenticacaoController from '@controllers/autorizacao.controller';
import CategoriaController from '@controllers/categoria.controller';
import ProdutoController from '@controllers/produto.controller';
import EstabelecimentoController from '@controllers/estabelecimento.controller';
import authMiddleware from './middlewares/autenticacao.middleware';

const router = Router();
const enderecoAPI = process.env.ADDRESS_API;

router.post(`${enderecoAPI}/autenticacao`, AutenticacaoController.autentica);
router.post(`${enderecoAPI}/usuarios/novo`, authMiddleware, UsuarioController.grava);
router.get(`${enderecoAPI}/usuarios`, authMiddleware, UsuarioController.lista);
router.get(`${enderecoAPI}/usuarios/:id`, authMiddleware, UsuarioController.buscaPorId);
router.get(`${enderecoAPI}/categorias`, authMiddleware, CategoriaController.lista);
router.get(`${enderecoAPI}/categorias/:id`, authMiddleware, CategoriaController.buscaPorId);
router.get(`${enderecoAPI}/produtos`, authMiddleware, ProdutoController.lista);
router.get(`${enderecoAPI}/produtos/:id`, authMiddleware, ProdutoController.buscaPorId);
router.get(`${enderecoAPI}/estabelecimentos`, authMiddleware, EstabelecimentoController.lista);
router.get(`${enderecoAPI}/estabelecimentos/:id`, authMiddleware, EstabelecimentoController.buscaPorId);

export default router;
