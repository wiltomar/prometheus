import { Router } from 'express';
import authMiddleware from './middlewares/authMiddleware';
import UserController from '@controllers/UserController';
import AuthController from '@controllers/AuthController';
import CategoryController from '@controllers/CategoryController';
import ProductController from '@controllers/ProductController';
import EstabelecimentoController from '@controllers/EstabelecimentoController';

const router = Router();

router.post('/auth', AuthController.authenticate);
router.post('/users/new', authMiddleware, UserController.store);
router.get('/users', authMiddleware, UserController.list);
router.get('/categories', authMiddleware, CategoryController.list);
router.get('/categories/:id', authMiddleware, CategoryController.findById);
router.get('/products', authMiddleware, ProductController.list);
router.get('/products/:id', authMiddleware, ProductController.findById);
router.get('/estabelecimentos', authMiddleware, EstabelecimentoController.list);
router.get('/estabelecimentos/:id', authMiddleware, EstabelecimentoController.findById);

export default router;
