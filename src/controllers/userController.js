const userService = require('../services/userService');
const statusCodes = require('../schemas/statusCodesSchema');
const errors = require('../schemas/errorsSchema');
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

    const isValid = await userService.signin({ email, password });

    if (!isValid) return next(errors.users.invalidData);

    const token = createToken({ email });

    return res.status(statusCodes.ok).json({ token });
  },
};
