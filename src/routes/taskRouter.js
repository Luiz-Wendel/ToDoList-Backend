const express = require('express');

const taskController = require('../controllers/taskController');

const jwtValidator = require('../middlewares/auth/jwtValidator');
const newTaskValidator = require('../middlewares/validators/newTaskValidator');
const taskValidator = require('../middlewares/validators/taskValidator');
const statusValidator = require('../middlewares/validators/statusValidator');
const mongoIdValidator = require('../middlewares/validators/mongoIdValidator');

const taskRouter = express.Router();

taskRouter.use(jwtValidator);

taskRouter.get('/', taskController.getAll);
taskRouter.post('/', newTaskValidator, taskController.create);
taskRouter.delete('/:id', mongoIdValidator, taskController.remove);
taskRouter.put('/:id', mongoIdValidator, taskValidator, taskController.update);
taskRouter.patch('/:id/status', mongoIdValidator, statusValidator, taskController.patchStatus);

module.exports = taskRouter;
