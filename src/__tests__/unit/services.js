const sinon = require('sinon');
const { expect } = require('chai');

const mockData = require('../mock/data');

const TaskModel = require('../../models/TaskModel');
const taskService = require('../../services/taskService');

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
    describe('when the sale is created successfully', () => {
      const task = mockData.tasks[0];
      const {
        _id: id, description, createdAt, status,
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

      it('should return an object with the "createdAt"', async () => {
        const response = await taskService.create(description);

        expect(response.createdAt).to.be.equal(createdAt);
      });

      it('should return an object with the "status"', async () => {
        const response = await taskService.create(description);

        expect(response.status).to.be.equal(status);
      });
    });
  });
});
