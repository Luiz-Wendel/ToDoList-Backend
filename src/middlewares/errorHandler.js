const statusCodes = require('../schemas/statusCodesSchema');

module.exports = (err, _req, res, _next) => res
  .status(statusCodes.internalServerError)
  .json(err);
