import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario';

class AutorizacaoController {
  async autentica(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Usuario);
      const { nome, senha } = req.body;

      const usuario: UsuarioProtegido = await repositorio.findOne({
        where: { nome, vendedor: true },
      });

      if (!usuario) {
        return res.status(401).json({ message: 'Usuário não encontrado!' });
      }

      const isSenhaValida = await bcrypt.compare(senha, usuario.senhaHash);

      if (!isSenhaValida) {
        return res.status(401).json({ message: 'Usuário e/ou senha inválidos!' });
      }

      const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY || 'M0d4l!', { expiresIn: '1d' });

      delete usuario.senha;
      delete usuario.senhaHash;

      return res.status(200).json({
        usuario,
        token,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new AutorizacaoController();
