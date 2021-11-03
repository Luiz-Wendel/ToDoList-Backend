const express = require('express');

const userController = require('../controllers/userController');

const userValidator = require('../middlewares/validators/userValidator');

const userRouter = express.Router();

userRouter.post('/', userValidator, userController.create);
userRouter.post('/signin', userValidator, userController.signin);

module.exports = userRouter;
