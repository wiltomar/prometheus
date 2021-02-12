/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import './database/connect';
import { load } from 'ts-dotenv';
import routes from './routes';
import manipuladorDeErro from './middlewares/erros.midlleware';
import manipuladorDeErroNaoEncontrado from './middlewares/naoencontrado.middleware';
import AgendamentoController from '@controllers/agendamento.controller';

const app = express();
const env = load({
  BASE_URL: String,
  NODE_ENV: [
    'production' as const,
    'development' as const,
  ],
  PORT: Number,
});
const serverPort = env.PORT || 3000;
const serverName = env.BASE_URL || 'Server';

if (!serverPort) {
  process.exit(1);
}

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(routes);

app.use(manipuladorDeErro);
app.use(manipuladorDeErroNaoEncontrado);

//const cron = require("node-cron");
//cron.schedule("*/3 * * * * *", AgendamentoController.procedimentos);

app.listen(serverPort, serverName, () => {
  console.log(`🚀 - Prometheus API Server started at http://${serverName}:${serverPort}`);
});