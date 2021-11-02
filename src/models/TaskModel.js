const mongoConnection = require('./index');

module.exports = {
  getAll: async () => {
    const tasksCollection = await mongoConnection.getConnection()
      .then((db) => db.collection('tasks'));

    const tasks = await tasksCollection.find().toArray();

    return tasks;
  },
};
