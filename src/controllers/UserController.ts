import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import User from '@models/User';

class UserController {
  async store(req: Request, res: Response) {
    const {
      UsuarioNome, UsuarioApelido, Inclusao, Senha, SenhaHash, Status, Ativo,
      Vendedor, Usuario, Comissao, UnidadeID,
    } = req.body;
    const repository = getRepository(User);

    const userExists = await repository.findOne({ where: { UsuarioNome } });

    if (userExists) {
      return res.json({ message: 'User already exists' });
    }

    const user = repository.create({
      UsuarioNome,
      UsuarioApelido,
      Inclusao,
      Senha,
      SenhaHash,
      Status,
      Ativo,
      Vendedor,
      Usuario,
      Comissao,
      UnidadeID,
    });
    await repository.save(user);

    return res.json(user);
  }

  async list(req: Request, res: Response) {
    const repository = getRepository(User);

    const users: UserProtected[] = await repository.find({ Status: 0, Vendedor: true });
    users.map((user) => {
      delete user.Senha;
      delete user.SenhaHash;
      return user;
    });

    return res.json(users);
  }

  async findbyName(req: Request, res: Response) {
    const repository = getRepository(User);
    const { UsuarioNome } = req.body;

    const user = await repository.findOne({ where: { UsuarioNome } });

    if (!user) {
      return res.json({ message: 'User not found!' });
    }

    return res.json(user);
  }
}

export default new UserController();
