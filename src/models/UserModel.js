const mongoConnection = require('./index');

const getUsersCollection = async () => mongoConnection.getConnection()
  .then((db) => db.collection('users'));

module.exports = {
  create: async (user) => {
    const usersCollection = await getUsersCollection();

    const { insertedId } = await usersCollection.insertOne(user);

    return insertedId;
  },
};
