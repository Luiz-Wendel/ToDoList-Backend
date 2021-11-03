const taskService = require('../services/taskService');
const statusCodes = require('../schemas/statusCodesSchema');

module.exports = {
  getAll: async (_req, res) => {
    const tasks = await taskService.getAll();

    return res.status(statusCodes.ok).json({ tasks });
  },

  create: async (req, res) => {
    const { description } = req.body;

    const createdTask = await taskService.create(description);

    return res.status(statusCodes.created).json(createdTask);
  },
};
