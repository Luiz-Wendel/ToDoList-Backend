const sinon = require('sinon');
const { expect } = require('chai');

const mockData = require('../mock/data');

const TaskModel = require('../../models/TaskModel');
const taskService = require('../../services/taskService');

describe('taskService', () => {
  describe('get all tasks', () => {
    describe('when it has no tasks', () => {
      before(() => {
        sinon.stub(TaskModel, 'getAll')
          .resolves({ tasks: [] });
      });

      after(() => {
        TaskModel.getAll.restore();
      });

      it('should return an object', async () => {
        const response = await taskService.getAll();

        expect(response).to.be.an('object');
      });

      it('should return an an object with the "tasks" property', async () => {
        const response = await taskService.getAll();

        expect(response).to.haveOwnProperty('tasks');
      });

      it('should return an object with the "tasks" property as an array', async () => {
        const response = await taskService.getAll();

        expect(response.tasks).to.be.an('array');
      });

      it('should return an object with the "tasks" property as an empty array', async () => {
        const response = await taskService.getAll();

        expect(response.tasks).to.be.empty;
      });
    });

    describe('when it has tasks', () => {
      const tasks = [...mockData.tasks];

      before(() => {
        sinon.stub(TaskModel, 'getAll')
          .resolves({ tasks });
      });

      after(() => {
        TaskModel.getAll.restore();
      });

      it('should return an object', async () => {
        const response = await taskService.getAll();

        expect(response).to.be.an('object');
      });

      it('should return an object with the "tasks" property', async () => {
        const response = await taskService.getAll();

        expect(response).to.haveOwnProperty('tasks');
      });

      it('should return an object with the "tasks" property as an array', async () => {
        const response = await taskService.getAll();

        expect(response.tasks).to.be.an('array');
      });

      it('should return an object with the "tasks" property as an array of objects', async () => {
        const response = await taskService.getAll();

        response.tasks.forEach((sale) => {
          expect(sale).to.be.an('object');
        });
      });

      it('should return an object with the "tasks" property as the tasks', async () => {
        const response = await taskService.getAll();

        expect(response.tasks).to.be.deep.equal(tasks);
      });
    });
  });
});
