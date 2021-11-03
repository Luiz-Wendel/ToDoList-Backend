const sinon = require('sinon');
const { expect } = require('chai');

const mockData = require('../mock/data');
const statusCodes = require('../../schemas/statusCodesSchema');
const errors = require('../../schemas/errorsSchema');

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

  describe('create', () => {
    describe('on success', () => {
      const task = mockData.tasks[0];
      const request = {};
      const response = {};

      before(async () => {
        request.body = { description: task.description };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'create').resolves(task);
      });

      after(() => {
        taskService.create.restore();
      });

      it(`should return status ${statusCodes.created}`, async () => {
        await taskController.create(request, response);

        expect(response.status.calledWith(statusCodes.created)).to.be.true;
      });

      it('should return a "json" with the task object', async () => {
        await taskController.create(request, response);

        expect(response.json.calledWith(task)).to.be.true;
      });
    });
  });

  describe('remove', () => {
    describe('on failure', () => {
      const { _id: id } = mockData.tasks[0];
      const request = {};
      const response = {};
      const next = sinon.spy();

      before(async () => {
        request.params = { id };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'remove').resolves(0);

        await taskController.remove(request, response, next);
      });

      after(() => {
        taskService.remove.restore();
      });

      it('should call "next"', async () => {
        expect(next.calledOnce).to.be.true;
      });

      it('should call "next" with the task not found error object', async () => {
        expect(next.calledWith(errors.tasks.notFound)).to.be.true;
      });
    });

    describe('on success', () => {
      const { _id: id } = mockData.tasks[0];
      const request = {};
      const response = {};

      before(async () => {
        request.params = { id };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'remove').resolves(1);

        await taskController.remove(request, response);
      });

      after(() => {
        taskService.remove.restore();
      });

      it(`should return status ${statusCodes.noContent}`, async () => {
        expect(response.status.calledWith(statusCodes.noContent)).to.be.true;
      });

      it('should return a "json" with an empty object', async () => {
        expect(response.json.calledWith({})).to.be.true;
      });
    });
  });

  describe('update', () => {
    describe('on failure', () => {
      const { _id: id, ...updatedTask } = mockData.tasks[0];
      const request = {};
      const response = {};
      const next = sinon.spy();

      before(async () => {
        request.params = { id };
        request.body = { ...updatedTask };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'update').resolves(0);

        await taskController.update(request, response, next);
      });

      after(() => {
        taskService.update.restore();
      });

      it('should call "next"', async () => {
        expect(next.calledOnce).to.be.true;
      });

      it('should call "next" with the task not found error object', async () => {
        expect(next.calledWith(errors.tasks.notUpdated)).to.be.true;
      });
    });

    describe('on success', () => {
      const { _id: id, ...updatedTask } = mockData.tasks[0];
      const request = {};
      const response = {};

      before(async () => {
        request.params = { id };
        request.body = { ...updatedTask };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'update').resolves(1);

        await taskController.update(request, response);
      });

      after(() => {
        taskService.update.restore();
      });

      it(`should return status ${statusCodes.ok}`, async () => {
        expect(response.status.calledWith(statusCodes.ok)).to.be.true;
      });

      it('should return a "json" with the updated task', async () => {
        expect(response.json.calledWith({ _id: id, ...updatedTask })).to.be.true;
      });
    });
  });

  describe('status patch', () => {
    describe('on failure', () => {
      const { _id: id, status } = mockData.tasks[0];
      const request = {};
      const response = {};
      const next = sinon.spy();

      before(async () => {
        request.params = { id };
        request.body = { status };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'update').resolves(0);

        await taskController.patchStatus(request, response, next);
      });

      after(() => {
        taskService.update.restore();
      });

      it('should call "next"', async () => {
        expect(next.calledOnce).to.be.true;
      });

      it('should call "next" with the task not found error object', async () => {
        expect(next.calledWith(errors.tasks.notUpdated)).to.be.true;
      });
    });

    describe('on success', () => {
      const { _id: id, status } = mockData.tasks[0];
      const request = {};
      const response = {};

      before(async () => {
        request.params = { id };
        request.body = { status };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'update').resolves(1);

        await taskController.patchStatus(request, response);
      });

      after(() => {
        taskService.update.restore();
      });

      it(`should return status ${statusCodes.noContent}`, async () => {
        expect(response.status.calledWith(statusCodes.noContent)).to.be.true;
      });

      it('should return a "json" with an empty object', async () => {
        expect(response.json.calledWith({})).to.be.true;
      });
    });
  });
});
