const { MongoClient } = require('mongodb');

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const { DB_URI, DB_NAME } = process.env;

let database = null;

const getConnection = () => (
  database
    ? Promise.resolve(database)
    : MongoClient.connect(DB_URI, OPTIONS).then((connection) => {
      database = connection.db(DB_NAME);
      return database;
    })
);

module.exports = { getConnection };
