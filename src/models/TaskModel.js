const { ObjectId } = require('mongodb');

const mongoConnection = require('./index');

const getTaskCollection = async () => mongoConnection.getConnection()
  .then((db) => db.collection('tasks'));

module.exports = {
  getAll: async () => {
    const tasksCollection = await getTaskCollection();

    const tasks = await tasksCollection.find().toArray();

    return tasks;
  },

  create: async (task) => {
    const tasksCollection = await getTaskCollection();

    const { insertedId } = await tasksCollection.insertOne(task);

    return insertedId;
  },

  remove: async (id) => {
    const tasksCollection = await getTaskCollection();

    const { deletedCount } = await tasksCollection.deleteOne({ _id: ObjectId(id) });

    return deletedCount;
  },
};
