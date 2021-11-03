const mongoConnection = require('./index');

const getUsersCollection = async () => mongoConnection.getConnection()
  .then((db) => db.collection('users'));

module.exports = {
  create: async (user) => {
    const usersCollection = await getUsersCollection();

    const { insertedId } = await usersCollection.insertOne(user);

    return insertedId;
  },

  findByEmail: async (email) => {
    const usersCollection = await getUsersCollection();

    const user = await usersCollection.findOne({ email });

    return user;
  },
};
