import { getRepository } from 'typeorm';
import { Request, Response } from 'express';

import Usuario from '@models/usuario';

class UsuarioController {
  async grava(req: Request, res: Response) {
    try {
      const {
        nome, inclusao, senha, senhaHash, status, ativo,
        vendedor, usuario, comissao, estabelecimentoID,
      } = req.body;
      const repositorio = getRepository(Usuario);

      const usuarioExiste = await repositorio.findOne({ where: { nome } });

      if (usuarioExiste) {
        return res.status(200).json({ message: 'Usuário já existe!' });
      }

      const instancia = repositorio.create({
        nome,
        inclusao,
        senha,
        senhaHash,
        status,
        ativo,
        vendedor,
        usuario,
        comissao,
        estabelecimentoID,
      });
      await repositorio.save(instancia);

      return res.status(201).json(instancia);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async lista(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Usuario);

      const lista: UsuarioProtegido[] = await repositorio.find({ status: 0, vendedor: true });
      lista.map((usuario) => {
        delete usuario.senha;
        delete usuario.senhaHash;
        return usuario;
      });

      return res.status(200).json(lista);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorNome(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Usuario);
      const { nome } = req.body;

      const usuario = await repositorio.findOne({ where: { nome } });

      if (!usuario) {
        return res.status(200).json({ message: 'Usuário não encontrado!' });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async buscaPorId(req: Request, res: Response) {
    try {
      const repositorio = getRepository(Usuario);
      const usuario = await repositorio.findOne(
        { where: { id: req.params.id, vendedor: true, ativo: true } },
      );

      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new UsuarioController();
