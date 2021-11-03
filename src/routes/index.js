const express = require('express');

const taskRouter = require('./taskRouter');
const userRouter = require('./userRouter');

const rootRouter = express.Router();

rootRouter.use('/tasks', taskRouter);
rootRouter.use('/users', userRouter);

module.exports = rootRouter;
