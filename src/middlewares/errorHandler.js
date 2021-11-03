const statusCodes = require('../schemas/statusCodesSchema');

module.exports = (err, _req, res, _next) => {
  let error = {};

  if (err.isJoi) {
    error = {
      code: 'precondition_failed',
      message: err.details[0].message,
    };

    return res.status(statusCodes.preconditionFailed).json(error);
  }

  if (err.statusCode) {
    error = {
      code: err.code,
      message: err.message,
    };

    return res.status(err.statusCode).json(error);
  }

  return res.status(statusCodes.internalServerError).json(err);
};
