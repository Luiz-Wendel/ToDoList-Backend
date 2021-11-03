const statusSchema = require('../../schemas/validators/statusSchema');

module.exports = (req, _res, next) => {
  const { body } = req;

  const { error } = statusSchema.validate(body);

  if (error) next(error);

  next();
};
