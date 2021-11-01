const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoConnection = require('../../models/connection');
const TaskModel = require('../../models/TaskModel');

describe('taskController', () => {
  describe('getAll', () => {
    const DBServer = new MongoMemoryServer();
    let connectionMock;

    before(async () => {
      const URLMock = await DBServer.getUri();

      connectionMock = await MongoClient
        .connect(URLMock, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then((conn) => conn.db('tests'));

      sinon.stub(mongoConnection, 'getConnection').resolves(connectionMock);
    });

    after(() => {
      mongoConnection.getConnection.restore();
    });

    describe('when it has no tasks', () => {
      it('should return an object', async () => {
        const response = await TaskModel.getAll();

        expect(response).to.be.an('object');
      });

      it('should have the "tasks" property', async () => {
        const response = await TaskModel.getAll();

        expect(response).to.have.a.property('tasks');
      });

      it('should have the "taks" property as an array', async () => {
        const response = await TaskModel.getAll();

        expect(response.tasks).to.be.an('array');
      });

      it('should have the "tasks" property with an empty array', async () => {
        const response = await TaskModel.getAll();

        expect(response.tasks).to.have.lengthOf(0);
      });
    });
  });
});
