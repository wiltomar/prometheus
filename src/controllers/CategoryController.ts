import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import Category from '@models/Category';

class CategoryController {
  async list(req: Request, res: Response) {
    const repository = getRepository(Category);
    const categories = await repository.find({ Status: 0, Venda: true });

    return res.json(categories);
  }

  async findbyName(req: Request, res: Response) {
    const repository = getRepository(Category);
    const { CategoriaNome } = req.body;

    const category = await repository.findOne({ where: { CategoriaNome } });

    if (!category) {
      return res.json({ message: 'Category not found!' });
    }

    return res.json(category);
  }

  async findById(req: Request, res: Response) {
    const repository = getRepository(Category);
    const category = await repository.findOne(
      { where: { CategoriaID: req.params.id, Venda: true } },
    );

    if (!category) {
      return res.json({ message: 'Category not found!' });
    }

    return res.json(category);
  }
}

export default new CategoryController();
