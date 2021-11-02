const sinon = require('sinon');
const { expect } = require('chai');

const mockData = require('../mock/data');
const statusCodes = require('../../schemas/statusCodesSchema');

const taskService = require('../../services/taskService');
const taskController = require('../../controllers/taskController');

describe('taskController', () => {
  describe('getAll', () => {
    describe('if there is no tasks', () => {
      const request = {};
      const response = {};

      before(async () => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'getAll').resolves([]);
      });

      after(() => {
        taskService.getAll.restore();
      });

      it(`should return status code ${statusCodes.ok}`, async () => {
        await taskController.getAll(request, response);

        expect(response.status.calledWith(statusCodes.ok)).to.be.true;
      });

      it('should return a json with an object', async () => {
        await taskController.getAll(request, response);

        expect(response.json.calledWith(sinon.match.object)).to.be.true;
      });

      it('should return a json with an object with the "tasks" property as an empty array', async () => {
        await taskController.getAll(request, response);

        expect(response.json.calledWith({ tasks: [] })).to.be.true;
      });
    });

    describe('if it has tasks', () => {
      const request = {};
      const response = {};
      const tasks = [...mockData.tasks];

      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'getAll').resolves(tasks);
      });

      after(() => {
        taskService.getAll.restore();
      });

      it(`should return status code ${statusCodes.ok}`, async () => {
        await taskController.getAll(request, response);

        expect(response.status.calledWith(statusCodes.ok)).to.be.true;
      });

      it('should return a json with an object', async () => {
        await taskController.getAll(request, response);

        expect(response.json.calledWith(sinon.match.object)).to.be.true;
      });

      it('should return a json with the tasks', async () => {
        await taskController.getAll(request, response);

        expect(response.json.calledWith({ tasks })).to.be.true;
      });
    });
  });
});
