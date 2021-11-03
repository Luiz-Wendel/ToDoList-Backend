const statusCodes = require('./statusCodesSchema');

module.exports = {
  tasks: {
    notFound: {
      statusCode: statusCodes.notFound,
      code: 'not_found',
      message: 'Task not found',
    },
    notUpdated: {
      statusCode: statusCodes.preconditionFailed,
      code: 'not_updated',
      message: 'Task not found or has nothing to update',
    },
  },
};
