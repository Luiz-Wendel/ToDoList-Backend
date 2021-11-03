const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

module.exports = {
  createToken: (payload) => {
    const jwtConfig = {
      expiresIn: '5h',
      algorithm: 'HS256',
    };

    return jwt.sign(payload, JWT_SECRET, jwtConfig);
  },
};
