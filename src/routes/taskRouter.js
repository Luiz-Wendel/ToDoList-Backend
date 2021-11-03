const express = require('express');

const taskController = require('../controllers/taskController');

const newTaskValidator = require('../middlewares/validators/newTaskValidator');
const taskValidator = require('../middlewares/validators/taskValidator');
const mongoIdValidator = require('../middlewares/validators/mongoIdValidator');

const taskRouter = express.Router();

taskRouter.get('/', taskController.getAll);
taskRouter.post('/', newTaskValidator, taskController.create);
taskRouter.delete('/:id', mongoIdValidator, taskController.remove);
taskRouter.put('/:id', mongoIdValidator, taskValidator, taskController.update);

module.exports = taskRouter;
