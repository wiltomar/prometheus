import express from 'express';

const app = express();

app.get('/', (req, res) => {
  return res.json({ message: 'Bem vindos à API do Prometheus!'});
}) 
app.listen(8080);