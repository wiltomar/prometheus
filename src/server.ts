/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import "reflect-metadata";
import 'module-alias/register';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import './database/connect';
import routes from './routes';
import manipuladorDeErro from './middlewares/erros.midlleware';
import manipuladorDeErroNaoEncontrado from './middlewares/naoencontrado.middleware';
import config from './config';
import fs from 'fs';
import { parse } from 'ini';

const app = express();

const iniFile = parse(fs.readFileSync(__dirname + '/config/prometheus.ini', 'utf-8'));
const serverPort =  iniFile.config.apiport || 1024;
const serverName = iniFile.config.baseurl || 'Server';

if (!serverPort) {
  process.exit(1);
}

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(routes);

app.use(manipuladorDeErro);
app.use(manipuladorDeErroNaoEncontrado);

app.listen(serverPort, serverName, () => {
  console.log(`🚀 - Prometheus API Server started at http://${serverName}:${serverPort}`);
});

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
  }).catch(err => {
    console.log('Houve uma falha nos pedidos.');
    console.error(err);
  });  
};

// if (config.impressao && config.impressaoUrl) {
//   console.log('iniciando o job de impressão');
//   const cron = require("node-cron");
//   const request = require('request');

//   cron.schedule("*/7 * * * * *", () => {
//     let s: string[] = [];
//     s.push(`SELECT COUNT(*) pedidos`);
//     s.push(`FROM`);
//     s.push(`  Mosaico.Pedido P`);
//     s.push(`  JOIN Mosaico.Lancamento L ON L.ID = P.LancamentoID`);
//     s.push(`WHERE`);
//     s.push(`  (P.Inclusao >= (GETDATE() - 0.5))`);
//     s.push(`  AND (P.EstabelecimentoID = ${config.estabelecimento.id})`);
//     s.push(`  AND (P.Tipo BETWEEN 16 AND 64)`);
//     s.push(`  AND (P.Natureza = -1)`);
//     s.push(`  AND (DATEDIFF(S, P.Inclusao, GETDATE()) > 7)`);
//     s.push(`  AND ((P.Status & 512) = 0)`);
//     s.push(`  AND ((L.Status & 8192) = 0);`);
//     getConnection().query(s.join(`\n`)).then(retorno => {      
//       if (!retorno) {
//         console.log('Não houve retorno da consulta dos pedidos a serem impressos');
//         return;
//       }
//       let pedidos = +retorno[0].pedidos;
//       if (pedidos === 0)
//         return;
//       console.log('Pedidos a serem impressos', pedidos);
//       request.post({
//         headers: { 'content-type': 'application/json' },
//         url: config.impressaoUrl,
//         body: JSON.stringify({ estabelecimentoID: config.estabelecimento.id })
//       }, (error: any, response: any) => {
//         if (error)
//           console.error('* erro: verifique se a api de impressão está em funcionamento', error);
//         console.log(new Date(), 'chamada da impressão concluída');
//         if (!response) {
//           console.error('* erro: não houve resposta, verifique se a api de impressão está em funcionamento');
//           return;
//         }        
//         if (response.statusCode !== 200)
//           console.error('* erro: ', response.body);
//       });  
//     });
//   }).catch(err => {
//     console.log('* erro no processamento da impressão.');
//     console.error(err);
//   });
// };