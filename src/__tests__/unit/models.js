const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mockData = require('../mock/data');

const mongoConnection = require('../../models');
const TaskModel = require('../../models/TaskModel');

describe('taskModel', () => {
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

  describe('getAll', () => {
    describe('when it has no tasks', () => {
      it('should return an array', async () => {
        const response = await TaskModel.getAll();

        expect(response).to.be.an('array');
      });

      it('should return an empty array', async () => {
        const response = await TaskModel.getAll();

        expect(response).to.be.empty;
      });
    });

    describe('when it has tasks', () => {
      const tasks = [...mockData.tasks];

      before(async () => {
        const asyncTaskInsertions = [];

        tasks.forEach((task) => {
          asyncTaskInsertions.push(connectionMock.collection('tasks').insertOne(task));
        });

        const insertions = await Promise.all(asyncTaskInsertions);

        insertions.forEach(({ insertedId }, index) => {
          tasks[index] = { ...tasks[index], _id: insertedId };
        });
      });

      after(async () => {
        await connectionMock.collection('tasks').deleteMany({});
      });

      it('should return an array', async () => {
        const response = await TaskModel.getAll();

        expect(response).to.be.an('array');
      });

      it('should return an array with the tasks', async () => {
        const response = await TaskModel.getAll();

        expect(response).to.have.lengthOf(tasks.length);
        response.forEach((task, index) => {
          expect(task).to.deep.equal(tasks[index]);
        });
      });
    });
  });

  describe('create', () => {
    describe('on success', () => {
      const task = mockData.tasks[0];
      const { description } = task;

      after(async () => {
        connectionMock.collection('tasks').deleteMany({});
      });

      it('should return a strin', async () => {
        const response = await TaskModel.create(task);

        expect(response).to.be.a('string');
      });

      it('should exist a task with the description on the db', async () => {
        const existingTask = await connectionMock.collection('tasks').findOne({ description });

        expect(existingTask).not.to.be.null;
      });
    });
  });
});
