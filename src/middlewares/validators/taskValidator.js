const taskSchema = require('../../schemas/validators/taskSchema');

module.exports = (req, res, next) => {
  const { body } = req;

  const { error } = taskSchema.validate(body);

  if (error) next(error);

  next();
};
