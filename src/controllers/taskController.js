const taskService = require('../services/taskService');
const statusCodes = require('../schemas/statusCodesSchema');

module.exports = {
  getAll: async (req, res) => {
    const { id } = req.user;

    const tasks = await taskService.getAll(id);

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
    const { id: userId } = req.user;
    const { id: taskId } = req.params;

    const result = await taskService.remove(taskId, userId);

    if (result.statusCode) return next(result);

    return res.status(statusCodes.noContent).json({});
  },

  update: async (req, res, next) => {
    const { id: userId } = req.user;
    const { id } = req.params;
    const { description, status } = req.body;

    const result = await taskService.update({
      _id: id, description, status, userId,
    });

    if (result.statusCode) return next(result);

    return res.status(statusCodes.ok).json(result);
  },

  patchStatus: async (req, res, next) => {
    const { id: userId } = req.user;
    const { id: taskId } = req.params;
    const { status } = req.body;

    const result = await taskService.update({ _id: taskId, status }, userId);

    if (result.statusCode) return next(result);

    return res.status(statusCodes.noContent).json({});
  },
};
