const express = require('express');

const taskController = require('../controllers/taskController');

const taskValidator = require('../middlewares/validators/taskValidator');

const taskRouter = express.Router();

taskRouter.get('/', taskController.getAll);
taskRouter.post('/', taskValidator, taskController.create);

module.exports = taskRouter;
