const express = require('express');
const cors = require('cors');
require('dotenv').config();

const rootRouter = require('../routes');

const errorHandler = require('../middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', rootRouter);

app.use(errorHandler);

module.exports = app;
