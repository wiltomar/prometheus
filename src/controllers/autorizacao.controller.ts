import { Request, Response } from 'express';
import { getManager, getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario';

class AutorizacaoController {
  async autentica(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Usuario);
      const { nome, senha } = req.body;

      const usuario = await repositorio.findOne({
        where: { nome: nome },
      });

      if (!usuario.vendedor)
        return res.status(401).json({ message: 'Usuário não é vendedor!' });

      if (!usuario) {
        return res.status(401).json({ message: 'Usuário não encontrado!' });
      }

      let isSenhaValida = false;
      if (usuario.senhaHash)
        isSenhaValida = await bcrypt.compare(senha, usuario.senhaHash);
      else {
        let senhaResult = await getManager().query(`SELECT dbo.CriptoStr255('${usuario.senha}', '') senha`);
        let senhaDecodificada: string = senhaResult[0].senha;
        let senhaFornecida: string = senha;
        isSenhaValida = (senhaFornecida.toLowerCase() === senhaDecodificada.toLocaleLowerCase());
      }
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
