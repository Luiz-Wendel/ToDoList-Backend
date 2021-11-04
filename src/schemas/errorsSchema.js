const statusCodes = require('./statusCodesSchema');

module.exports = {
  tasks: {
    notFound: {
      statusCode: statusCodes.notFound,
      code: 'not_found',
      message: 'Task not found',
    },
    ownership: {
      statusCode: statusCodes.forbidden,
      code: 'not_allowed',
      message: 'Forbidden',
    },
  },

  users: {
    alreadyExists: {
      statusCode: statusCodes.conflict,
      code: 'already_exists',
      message: 'User email already registered',
    },
    invalidData: {
      statusCode: statusCodes.badRequest,
      code: 'invalid_data',
      message: 'Invalid email or password',
    },
  },

  jwt: {
    notFound: {
      statusCode: statusCodes.unauthorized,
      code: 'missing_token',
      message: 'Missing auth token',
    },
    invalid: {
      statusCode: statusCodes.unauthorized,
      code: 'invalid_token',
      message: 'Invalid token',
    },
  },
};
