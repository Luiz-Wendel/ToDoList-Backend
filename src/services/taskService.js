const TaskModel = require('../models/TaskModel');

module.exports = {
  getAll: async () => {
    const tasks = await TaskModel.getAll();

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

  update: async (updatedTask) => {
    const updated = await TaskModel.update(updatedTask);

    return updated;
  },
};
