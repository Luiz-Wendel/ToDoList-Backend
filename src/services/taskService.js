const TaskModel = require('../models/TaskModel');

module.exports = {
  getAll: async () => {
    const tasks = await TaskModel.getAll();

    return tasks;
  },
};
