import { Request, Response, NextFunction } from 'express';

const manipuladorDeErroNaoEncontrado = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const messagem = 'Recurso não encontrado!';

  response.status(404).json({ message: messagem });
};

export default manipuladorDeErroNaoEncontrado;
