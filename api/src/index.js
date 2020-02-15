const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const host = process.env.NODE_ENV || '0.0.0.0';

if ( ! process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

require('./config');
require('./services/mongo');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/v1', routes);

app.listen(port, host);

console.log(`[${process.env.NODE_ENV}] Running on http://${host}:${port}`);
