import express from 'express';
import { config } from './loadConfig';

const app = express();
const port = config.port;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
