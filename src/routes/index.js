const express = require('express');

const taskRouter = require('./taskRouter');

const rootRouter = express.Router();

rootRouter.use('/tasks', taskRouter);

module.exports = rootRouter;
