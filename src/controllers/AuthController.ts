import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '@models/User';

class AuthController {
  async authenticate(req: Request, res: Response) {
    const repository = getRepository(User);
    const { UsuarioNome, Senha } = req.body;

    const user: UserProtected = await repository.findOne({
      where: { UsuarioNome, Vendedor: true },
    });

    if (!user) {
      return res.sendStatus(401);
    }

    const isValidPassword = await bcrypt.compare(Senha, user.SenhaHash);

    if (!isValidPassword) {
      return res.sendStatus(401);
    }

    const token = jwt.sign({ UsuarioID: user.UsuarioID }, process.env.SECRET_KEY || 'M0d4l!', { expiresIn: '1d' });

    delete user.Senha;
    delete user.SenhaHash;

    return res.json({
      user,
      token,
    });
  }
}

export default new AuthController();
