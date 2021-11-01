const taskService = require('../services/taskService');
const statusCodes = require('../schemas/statusCodesSchema');

module.exports = {
  getAll: async (_req, res) => {
    const tasks = await taskService.getAll();

    return res.status(statusCodes.ok).json(tasks);
  },
};
