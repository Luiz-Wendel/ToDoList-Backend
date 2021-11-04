const { ObjectId } = require('mongodb');

const mongoConnection = require('./index');

const getTaskCollection = async () => mongoConnection.getConnection()
  .then((db) => db.collection('tasks'));

module.exports = {
  getAll: async (userId) => {
    const tasksCollection = await getTaskCollection();

    const tasks = await tasksCollection.find({ userId }).toArray();

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

  update: async ({ _id: id, ...updatedTask }) => {
    const tasksCollection = await getTaskCollection();

    const { modifiedCount } = await tasksCollection
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...updatedTask } });

    return modifiedCount;
  },

  getById: async (id) => {
    const tasksCollection = await getTaskCollection();

    const task = tasksCollection.findOne({ _id: new ObjectId(id) });

    return task;
  },
};
