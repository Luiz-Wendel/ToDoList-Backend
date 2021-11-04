const { validateToken } = require('../../helpers/jwt');
const errors = require('../../schemas/errorsSchema');

module.exports = (req, _res, next) => {
  const { authorization: token } = req.headers;

  if (!token) return next(errors.jwt.notFound);

  try {
    const payload = validateToken(token);

    req.user = payload;

    return next();
  } catch (_error) {
    return next(errors.jwt.invalid);
  }
};
