if ( ! process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

import './config';
import './services/mongo';

import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/v1', routes);

app.listen(process.env.PORT, process.env.BASE_URL, () => {
  console.log(`[${process.env.NODE_ENV}] Running on http://${host}:${port}`);
});
