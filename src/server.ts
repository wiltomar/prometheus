/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import './database/connect';
import { load } from 'ts-dotenv';
import routes from './routes';

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

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(serverPort, serverName, () => {
  console.log(`🚀 - Prometheus API Server started at http://${serverName}:${serverPort}`);
});
