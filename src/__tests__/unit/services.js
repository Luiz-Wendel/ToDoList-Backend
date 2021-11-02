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
});
