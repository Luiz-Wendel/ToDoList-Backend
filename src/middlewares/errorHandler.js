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

  return res.status(statusCodes.internalServerError).json(err);
};
