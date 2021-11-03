const sinon = require('sinon');
const { expect } = require('chai');

const mockData = require('../mock/data');

const TaskModel = require('../../models/TaskModel');
const taskService = require('../../services/taskService');
const UserModel = require('../../models/UserModel');
const userService = require('../../services/userService');

const errors = require('../../schemas/errorsSchema');

describe('taskService', () => {
  describe('getAll', () => {
    describe('when it has no tasks', () => {
      before(() => {
        sinon.stub(TaskModel, 'getAll')
          .resolves([]);
      });

      after(() => {
        TaskModel.getAll.restore();
      });

      it('should return an array', async () => {
        const response = await taskService.getAll();

        expect(response).to.be.an('array');
      });

      it('should return an empty array', async () => {
        const response = await taskService.getAll();

        expect(response).to.be.empty;
      });
    });

    describe('when it has tasks', () => {
      const tasks = [...mockData.tasks];

      before(() => {
        sinon.stub(TaskModel, 'getAll')
          .resolves(tasks);
      });

      after(() => {
        TaskModel.getAll.restore();
      });

      it('should return an array', async () => {
        const response = await taskService.getAll();

        expect(response).to.be.an('array');
      });

      it('should return an array with the tasks', async () => {
        const response = await taskService.getAll();

        expect(response).to.be.deep.equal(tasks);
      });
    });
  });

  describe('create', () => {
    describe('when the task is created successfully', () => {
      const task = mockData.tasks[0];
      const {
        _id: id, description, status,
      } = task;

      before(() => {
        sinon.stub(TaskModel, 'create').resolves(id);
      });

      after(() => {
        TaskModel.create.restore();
      });

      it('should return an object', async () => {
        const response = await taskService.create(description);

        expect(response).to.be.an('object');
      });

      it('should return an object with the task properties', async () => {
        const taskProperties = Object.keys(task);

        const response = await taskService.create(description);

        expect(response).to.have.all.keys(taskProperties);
      });

      it('should return an object with the "_id"', async () => {
        const { _id: newTaskId } = await taskService.create(description);

        expect(newTaskId).to.be.equal(id);
      });

      it('should return an object with the "description"', async () => {
        const response = await taskService.create(description);

        expect(response.description).to.be.equal(description);
      });

      it('should return an object with the "createdAt" as a number', async () => {
        const response = await taskService.create(description);

        expect(response.createdAt).to.be.a('number');
        expect(response.createdAt).to.be.above(0);
      });

      it('should return an object with the "status"', async () => {
        const response = await taskService.create(description);

        expect(response.status).to.be.equal(status);
      });
    });
  });

  describe('remove', () => {
    const { _id: id } = mockData.tasks[0];

    describe('when the task does not exists', () => {
      let response;

      before(async () => {
        sinon.stub(TaskModel, 'remove').resolves(0);

        response = await taskService.remove(id);
      });

      after(() => {
        TaskModel.remove.restore();
      });

      it('should return a number', () => {
        expect(response).to.be.a('number');
      });

      it('should return 0', () => {
        expect(response).to.be.equal(0);
      });
    });

    describe('when the task is deleted successfully', () => {
      let response;

      before(async () => {
        sinon.stub(TaskModel, 'remove').resolves(1);

        response = await taskService.remove(id);
      });

      after(() => {
        TaskModel.remove.restore();
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
    const task = mockData.tasks[0];

    describe('when the task does not exists', () => {
      let response;

      before(async () => {
        sinon.stub(TaskModel, 'update').resolves(0);

        response = await taskService.update(task);
      });

      after(() => {
        TaskModel.update.restore();
      });

      it('should return a number', () => {
        expect(response).to.be.a('number');
      });

      it('should return 0', () => {
        expect(response).to.be.equal(0);
      });
    });

    describe('when the task is updated successfully', () => {
      let response;

      before(async () => {
        sinon.stub(TaskModel, 'update').resolves(1);

        response = await taskService.update(task);
      });

      after(() => {
        TaskModel.update.restore();
      });

      it('should return a number', () => {
        expect(response).to.be.a('number');
      });

      it('should return 1', () => {
        expect(response).to.be.equal(1);
      });
    });
  });
});

describe('userService', () => {
  describe('create', () => {
    describe('when user email already exists', () => {
      const { user } = mockData;
      const errorObject = errors.users.alreadyExists;
      let response;

      before(async () => {
        sinon.stub(UserModel, 'findByEmail').resolves(user);

        response = await userService.create(user);
      });

      after(() => {
        UserModel.findByEmail.restore();
      });

      it('should return an object', async () => {
        expect(response).to.be.an('object');
      });

      it('should return the error object', async () => {
        expect(response).to.deep.equal(errorObject);
      });
    });

    describe('when the user is created successfully', () => {
      const { _id: id, ...user } = mockData.user;
      let response;

      before(async () => {
        sinon.stub(UserModel, 'findByEmail').resolves(null);
        sinon.stub(UserModel, 'create').resolves(id);

        response = await userService.create(user);
      });

      after(() => {
        UserModel.create.restore();
        UserModel.findByEmail.restore();
      });

      it('should return an object', async () => {
        expect(response).to.be.an('object');
      });

      it('should return an object with the user properties', async () => {
        const userProperties = ['_id', ...Object.keys(user)];

        expect(response).to.have.all.keys(userProperties);
      });

      it('should return an object with the created user info', async () => {
        expect(response).to.deep.equal({ _id: id, ...user });
      });
    });
  });

  describe('signin', () => {
    describe('when user does not exist', () => {
      const { _id, ...user } = mockData;
      const errorObject = errors.users.invalidData;
      let response;

      before(async () => {
        sinon.stub(UserModel, 'findByEmail').resolves(null);

        response = await userService.signin({ ...user });
      });

      after(() => {
        UserModel.findByEmail.restore();
      });

      it('should return an object', async () => {
        expect(response).to.be.an('object');
      });

      it('should return the invalid data error object', async () => {
        expect(response).to.deep.equal(errorObject);
      });
    });

    describe('when password does not match', () => {
      const { _id, ...user } = mockData;
      const errorObject = errors.users.invalidData;
      let response;

      before(async () => {
        sinon.stub(UserModel, 'findByEmail').resolves({ _id, ...user });

        response = await userService.signin({ ...user, password: 'xablau' });
      });

      after(() => {
        UserModel.findByEmail.restore();
      });

      it('should return an object', async () => {
        expect(response).to.be.an('object');
      });

      it('should return the invalid data error object', async () => {
        expect(response).to.deep.equal(errorObject);
      });
    });

    describe('on success', () => {
      const { _id, ...user } = mockData;
      let response;

      before(async () => {
        sinon.stub(UserModel, 'findByEmail').resolves({ _id, ...user });

        response = await userService.signin({ ...user });
      });

      after(() => {
        UserModel.findByEmail.restore();
      });

      it('should return an object', async () => {
        expect(response).to.be.an('object');
      });

      it('should return the invalid data error object', async () => {
        expect(response).to.deep.equal({ _id, ...user });
      });
    });
  });
});
