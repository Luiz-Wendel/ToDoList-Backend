const TaskModel = require('../models/TaskModel');
const errors = require('../schemas/errorsSchema');

const isOwner = (task, userId) => task.userId === userId;

module.exports = {
  getAll: async (userId) => {
    const tasks = await TaskModel.getAll(userId);

    return tasks;
  },

  create: async (task) => {
    const insertedId = await TaskModel.create(task);

    return { _id: insertedId, ...task };
  },

  remove: async (taskId, userId) => {
    const task = await TaskModel.getById(taskId);

    if (!task) return errors.tasks.notFound;

    if (!isOwner(task, userId)) return errors.tasks.ownership;

    await TaskModel.remove(taskId);

    return task;
  },

  update: async (updatedTask, userId) => {
    const { _id: taskId } = updatedTask;

    const task = await TaskModel.getById(taskId);

    if (!task) return errors.tasks.notFound;

    if (!isOwner(task, userId)) return errors.tasks.ownership;

    await TaskModel.update(updatedTask);

    return { ...task, ...updatedTask };
  },
};
