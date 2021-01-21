import { Router } from 'express';
import UserController from '@controllers/UserController';
import AuthController from '@controllers/AuthController';
import CategoryController from '@controllers/CategoryController';
import ProductController from '@controllers/ProductController';
import EstabelecimentoController from '@controllers/EstabelecimentoController';
import authMiddleware from './middlewares/authMiddleware';

const router = Router();
const addressAPI = process.env.ADDRESS_API;

router.post(`${addressAPI}/auth`, AuthController.authenticate);
router.post(`${addressAPI}/users/new`, authMiddleware, UserController.store);
router.get(`${addressAPI}/users`, authMiddleware, UserController.list);
router.get(`${addressAPI}/categories`, authMiddleware, CategoryController.list);
router.get(`${addressAPI}/categories/:id`, authMiddleware, CategoryController.findById);
router.get(`${addressAPI}/products`, authMiddleware, ProductController.list);
router.get(`${addressAPI}/products/:id`, authMiddleware, ProductController.findById);
router.get(`${addressAPI}/estabelecimentos`, authMiddleware, EstabelecimentoController.list);
router.get(`${addressAPI}/estabelecimentos/:id`, authMiddleware, EstabelecimentoController.findById);

export default router;
