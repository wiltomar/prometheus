/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import 'module-alias/register';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import './database/connect';
import { load } from 'ts-dotenv';
import routes from './routes';
import manipuladorDeErro from './middlewares/erros.midlleware';
import manipuladorDeErroNaoEncontrado from './middlewares/naoencontrado.middleware';
import config from './config';

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

if (config.foodyDelivery.ativo) {
  const cron = require("node-cron");
  const request = require('request');
  cron.schedule("*/7 * * * * *", () => {
    request(`http://${serverName}:${serverPort}/api/v1/procedimentos`, (error: any, response: any) => {
      if (error)
        console.error('erro ao executar o agendamento', error);
      console.log(new Date(), 'chamada normal');
      if (response.statusCode === 200)
        console.log(response.body);
      else
        console.error('* erro: ', response.body);
    });
  });  
}
if (config.impressao && config.impressaoUrl) {
  console.log('iniciando o job de impressão');
  const cron = require("node-cron");
  const request = require('request');
  cron.schedule("*/7 * * * * *", () => {
    request.post({
      headers: {'content-type': 'application/json' },
      url: config.impressaoUrl,
      body: JSON.stringify({ estabelecimentoID: config.estabelecimento.id })
    }, (error: any, response: any) => {
      if (error)
        console.error('erro ao executar o agendamento', error);
      console.log(new Date(), 'chamada normal');
      if (!response) {
        console.error('* erro: não houve resposta');
        return;
      }        
      if (response.statusCode !== 200)
        console.error('* erro: ', response.body);
    });
  });
}

app.listen(serverPort, serverName, () => {
  console.log(`🚀 - Prometheus API Server started at http://${serverName}:${serverPort}`);
});