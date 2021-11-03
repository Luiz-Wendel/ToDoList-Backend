const mongoIdSchema = require('../../schemas/validators/mongoIdSchema');

module.exports = (req, _res, next) => {
  const { params } = req;

  const { error } = mongoIdSchema.validate(params);

  if (error) next(error);

  next();
};
