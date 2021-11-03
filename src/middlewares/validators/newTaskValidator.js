const newTaskSchema = require('../../schemas/validators/newTaskSchema');

module.exports = (req, _res, next) => {
  const { body } = req;

  const { error } = newTaskSchema.validate(body);

  if (error) next(error);

  next();
};
