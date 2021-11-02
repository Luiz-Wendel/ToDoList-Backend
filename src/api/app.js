const express = require('express');
const cors = require('cors');
require('dotenv').config();

const rootRouter = require('../routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', rootRouter);

module.exports = app;
