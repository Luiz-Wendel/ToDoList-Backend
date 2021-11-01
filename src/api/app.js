const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.status(200).json({ message: 'ok' }));

module.exports = app;
