const taskService = require('../services/taskService');
const statusCodes = require('../schemas/statusCodesSchema');
const errors = require('../schemas/errorsSchema');

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

  remove: async (req, res, next) => {
    const { id } = req.params;

    const deleted = await taskService.remove(id);

    if (!deleted) return next(errors.tasks.notFound);

    return res.status(statusCodes.noContent).json({});
  },
};
