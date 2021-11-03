const userService = require('../services/userService');
const statusCodes = require('../schemas/statusCodesSchema');

module.exports = {
  create: async (req, res, next) => {
    const { email, password } = req.body;

    const result = await userService.create({ email, password });

    if (result.statusCode) next(result);

    return res.status(statusCodes.created).json(result);
  },
};
