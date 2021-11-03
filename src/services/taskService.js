const TaskModel = require('../models/TaskModel');

module.exports = {
  getAll: async () => {
    const tasks = await TaskModel.getAll();

    return tasks;
  },

  create: async (description) => {
    const task = { description, createdAt: Date.now(), status: 'Pending' };

    const insertedId = await TaskModel.create(task);

    return { _id: insertedId, ...task };
  },
};
