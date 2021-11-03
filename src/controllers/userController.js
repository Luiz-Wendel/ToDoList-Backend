const userService = require('../services/userService');
const statusCodes = require('../schemas/statusCodesSchema');
const { createToken } = require('../helpers/jwt');

module.exports = {
  create: async (req, res, next) => {
    const { email, password } = req.body;

    const result = await userService.create({ email, password });

    if (result.statusCode) next(result);

    return res.status(statusCodes.created).json(result);
  },

  signin: async (req, res, next) => {
    const { email, password } = req.body;

    const result = await userService.signin({ email, password });

    if (result.statusCode) return next(result);

    const { _id: id } = result;

    const token = createToken({ id, email });

    return res.status(statusCodes.ok).json({ token });
  },
};
