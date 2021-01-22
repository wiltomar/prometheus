import { Request, Response, NextFunction } from 'express';
import ExcecoesHttp from '../common/excecoes.http';

const manipuladorDeErro = (
  error: ExcecoesHttp,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const status = error.statusCode || error.status || 500;

  response.status(status).send(error);
};

export default manipuladorDeErro;
