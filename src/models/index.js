const { MongoClient } = require('mongodb');

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const {
  DB_USERNAME, DB_PASSWORD, DB_CLUSTER, DB_LOCATION, DB_NAME,
} = process.env;
const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.${DB_LOCATION}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

let database = null;

const getConnection = () => (
  database
    ? Promise.resolve(database)
    : MongoClient.connect(uri, OPTIONS).then((connection) => {
      database = connection.db(DB_NAME);
      return database;
    })
);

module.exports = { getConnection };
