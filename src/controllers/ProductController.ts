import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import Product from '@models/Product';

class ProductController {
  async list(req: Request, res: Response) {
    const repository = getRepository(Product);
    const products = await repository.find({ Status: 0, Venda: true, Ativo: true });

    return res.json(products);
  }

  async findbyName(req: Request, res: Response) {
    const repository = getRepository(Product);
    const { ProdutoNome } = req.body;

    const product = await repository.findOne({ where: { ProdutoNome } });

    if (!product) {
      return res.json({ message: 'Product not found!' });
    }

    return res.json(product);
  }

  async findById(req: Request, res: Response) {
    const repository = getRepository(Product);
    const product = await repository.findOne(
      { where: { ProdutoID: req.params.id, Venda: true, Ativo: true } },
    );

    if (!product) {
      return res.json({ message: 'Product not found!' });
    }

    return res.json(product);
  }
}

export default new ProductController();
