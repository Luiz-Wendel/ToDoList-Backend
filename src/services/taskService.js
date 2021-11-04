const TaskModel = require('../models/TaskModel');
const errors = require('../schemas/errorsSchema');

const isOwner = async (task, userId) => task.userId === userId;

module.exports = {
  getAll: async (userId) => {
    const tasks = await TaskModel.getAll(userId);

    return tasks;
  },

  create: async (task) => {
    const insertedId = await TaskModel.create(task);

    return { _id: insertedId, ...task };
  },

  remove: async (id) => {
    const deleted = await TaskModel.remove(id);

    return deleted;
  },

  update: async (updatedTask, userId) => {
    const { _id: taskId } = updatedTask;

    const task = await TaskModel.getById(taskId);

    if (!task) return errors.tasks.notFound;

    const canUpdate = await isOwner(task, userId);
    if (!canUpdate) return errors.tasks.ownership;

    await TaskModel.update(updatedTask);

    return { ...task, ...updatedTask };
  },
};
