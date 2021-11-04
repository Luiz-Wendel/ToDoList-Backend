const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mockData = require('../mock/data');

const mongoConnection = require('../../models');
const TaskModel = require('../../models/TaskModel');
const UserModel = require('../../models/UserModel');

describe('TaskModel', () => {
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
    const { _id: userId } = mockData.users[0];

    describe('when it has no tasks', () => {
      let response;

      before(async () => {
        response = await TaskModel.getAll(userId);
      });

      it('should return an array', async () => {
        expect(response).to.be.an('array');
      });

      it('should return an empty array', async () => {
        expect(response).to.be.empty;
      });
    });

    describe('when it has tasks', () => {
      const tasks = mockData.tasks.filter((task) => task.userId === userId);
      let response;

      before(async () => {
        const asyncTaskInsertions = [];

        tasks.forEach((task) => {
          asyncTaskInsertions.push(connectionMock.collection('tasks').insertOne(task));
        });

        const insertions = await Promise.all(asyncTaskInsertions);

        insertions.forEach(({ insertedId }, index) => {
          tasks[index] = { ...tasks[index], _id: insertedId };
        });

        response = await TaskModel.getAll(userId);
      });

      after(async () => {
        await connectionMock.collection('tasks').deleteMany({});
      });

      it('should return an array', async () => {
        expect(response).to.be.an('array');
      });

      it('should return an array with the tasks', async () => {
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

      it('should return a string', async () => {
        const response = await TaskModel.create(task);

        expect(response).to.be.a('string');
      });

      it('should exist a task with the description on the db', async () => {
        const existingTask = await connectionMock.collection('tasks').findOne({ description });

        expect(existingTask).not.to.be.null;
      });
    });
  });

  describe('remove', () => {
    describe('on success', () => {
      let response;

      before(async () => {
        const { _id, ...task } = mockData.tasks[0];

        const { insertedId } = await connectionMock.collection('tasks').insertOne(task);

        response = await TaskModel.remove(insertedId.toString());
      });

      it('should return a number', () => {
        expect(response).to.be.a('number');
      });

      it('should return 1', () => {
        expect(response).to.be.equal(1);
      });
    });
  });

  describe('update', () => {
    describe('on success', () => {
      const { _id: _taskId, ...task } = mockData.tasks[0];
      const { _id: _updatedTaskId, ...updatedTask } = mockData.tasks[1];
      let response;

      before(async () => {
        const { insertedId } = await connectionMock.collection('tasks').insertOne(task);

        response = await TaskModel.update({ _id: insertedId, ...updatedTask });
      });

      after(async () => {
        connectionMock.collection('tasks').deleteMany({});
      });

      it('should return a number', async () => {
        expect(response).to.be.a('number');
      });

      it('should return 1', async () => {
        expect(response).to.be.equal(1);
      });

      it('should exist a task with the new description on the db', async () => {
        const existingTask = await connectionMock
          .collection('tasks')
          .findOne({ description: updatedTask.description });

        expect(existingTask).not.to.be.null;
      });
    });
  });

  describe('getById', () => {
    describe('when the task does not exist', () => {
      const { _id: id } = mockData.tasks[0];

      it('should return null', async () => {
        const response = await TaskModel.getById(id);

        expect(response).to.be.null;
      });
    });

    describe('when it has tasks', () => {
      const { _id, ...task } = mockData.tasks[0];
      let id;
      let response;

      before(async () => {
        const { insertedId } = await connectionMock.collection('tasks').insertOne(task);
        id = insertedId;

        response = await TaskModel.getById(insertedId);
      });

      after(async () => {
        await connectionMock.collection('tasks').deleteMany({});
      });

      it('should return an object', async () => {
        expect(response).to.be.an('object');
      });

      it('should return the task', async () => {
        expect(response).to.deep.equal({ _id: id, ...task });
      });
    });
  });
});

describe('UserModel', () => {
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

  describe('create', () => {
    describe('on success', () => {
      const user = mockData.users[0];
      const { email } = user;

      after(async () => {
        connectionMock.collection('users').deleteMany({});
      });

      it('should return a string', async () => {
        const response = await UserModel.create(user);

        expect(response).to.be.a('string');
      });

      it('should exist a user with the email on the db', async () => {
        const existingUser = await connectionMock.collection('users').findOne({ email });

        expect(existingUser).not.to.be.null;
      });
    });
  });

  describe('findByEmail', () => {
    describe('on failure', () => {
      const { email } = mockData.users[0];
      let response;

      before(async () => {
        response = await UserModel.findByEmail(email);
      });

      it('should return null', async () => {
        expect(response).to.be.null;
      });
    });

    describe('on success', () => {
      const { _id, ...user } = mockData;
      let response;

      before(async () => {
        await connectionMock.collection('users').insertOne(user);

        response = await UserModel.findByEmail(user.email);
      });

      after(async () => {
        await connectionMock.collection('users').deleteMany({});
      });

      it('should return an object', () => {
        expect(response).to.be.an('object');
      });

      it('should return an object with the user properties', () => {
        const userProperties = Object.keys(user);

        expect(response).to.have.all.keys(userProperties);
      });

      it('should return an object with the inserted user info', () => {
        expect(response.email).to.be.equal(user.email);
        expect(response.password).to.be.equal(user.password);
      });
    });
  });
});
