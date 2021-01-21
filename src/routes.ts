import { Router } from 'express';
import UserController from '@controllers/UserController';
import AuthController from '@controllers/AuthController';
import CategoryController from '@controllers/CategoryController';
import ProductController from '@controllers/ProductController';

import authMiddleware from './middlewares/authMiddleware';

const router = Router();

router.post('/users/new', authMiddleware, UserController.store);
router.get('/users', authMiddleware, UserController.list);
router.get('/categories', authMiddleware, CategoryController.list);
router.get('/categories/:id', authMiddleware, CategoryController.findById);
router.get('/products', authMiddleware, ProductController.list);
router.get('/products/:id', authMiddleware, ProductController.findById);
router.post('/auth', AuthController.authenticate);

export default router;
