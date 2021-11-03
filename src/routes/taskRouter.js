const express = require('express');

const taskController = require('../controllers/taskController');

const taskValidator = require('../middlewares/validators/taskValidator');
const mongoIdValidator = require('../middlewares/validators/mongoIdValidator');

const taskRouter = express.Router();

taskRouter.get('/', taskController.getAll);
taskRouter.post('/', taskValidator, taskController.create);
taskRouter.delete('/:id', mongoIdValidator, taskController.remove);

module.exports = taskRouter;
