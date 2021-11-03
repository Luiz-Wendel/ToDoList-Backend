const userSchema = require('../../schemas/validators/userSchema');

module.exports = (req, _res, next) => {
  const { body } = req;

  const { error } = userSchema.validate(body);

  if (error) next(error);

  next();
};
