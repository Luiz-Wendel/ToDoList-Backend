const taskService = require('../services/taskService');
const statusCodes = require('../schemas/statusCodesSchema');
const errors = require('../schemas/errorsSchema');

module.exports = {
  getAll: async (_req, res) => {
    const tasks = await taskService.getAll();

    return res.status(statusCodes.ok).json({ tasks });
  },

  create: async (req, res) => {
    const { body: { description }, user: { id } } = req;

    const task = {
      description, createdAt: Date.now(), status: 'Pending', userId: id,
    };

    const createdTask = await taskService.create(task);

    return res.status(statusCodes.created).json(createdTask);
  },

  remove: async (req, res, next) => {
    const { id } = req.params;

    const deleted = await taskService.remove(id);

    if (!deleted) return next(errors.tasks.notFound);

    return res.status(statusCodes.noContent).json({});
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    const { description, createdAt, status } = req.body;

    const updated = await taskService.update({ _id: id, description, status });

    if (!updated) return next(errors.tasks.notUpdated);

    return res.status(statusCodes.ok).json({
      _id: id, description, createdAt, status,
    });
  },

  patchStatus: async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await taskService.update({ _id: id, status });

    if (!updated) return next(errors.tasks.notUpdated);

    return res.status(statusCodes.noContent).json({});
  },
};
