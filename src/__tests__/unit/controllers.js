const sinon = require('sinon');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

const mockData = require('../mock/data');
const statusCodes = require('../../schemas/statusCodesSchema');
const errors = require('../../schemas/errorsSchema');

const taskService = require('../../services/taskService');
const taskController = require('../../controllers/taskController');
const userService = require('../../services/userService');
const userController = require('../../controllers/userController');

describe('taskController', () => {
  describe('getAll', () => {
    describe('if there is no tasks', () => {
      const { _id: userId, email } = mockData.users[0];
      const request = {};
      const response = {};

      before(async () => {
        request.user = { id: userId, email };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'getAll').resolves([]);

        await taskController.getAll(request, response);
      });

      after(() => {
        taskService.getAll.restore();
      });

      it(`should return status code ${statusCodes.ok}`, async () => {
        expect(response.status.calledWith(statusCodes.ok)).to.be.true;
      });

      it('should return a json with an object', async () => {
        expect(response.json.calledWith(sinon.match.object)).to.be.true;
      });

      it('should return a json with an object with the "tasks" property as an empty array', async () => {
        expect(response.json.calledWith({ tasks: [] })).to.be.true;
      });
    });

    describe('if it has tasks', () => {
      const { _id: userId, email } = mockData.users[0];
      const tasks = mockData.tasks.filter((task) => task.userId === userId);
      const request = {};
      const response = {};

      before(async () => {
        request.user = { id: userId, email };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'getAll').resolves(tasks);

        await taskController.getAll(request, response);
      });

      after(() => {
        taskService.getAll.restore();
      });

      it(`should return status code ${statusCodes.ok}`, async () => {
        expect(response.status.calledWith(statusCodes.ok)).to.be.true;
      });

      it('should return a json with an object', async () => {
        expect(response.json.calledWith(sinon.match.object)).to.be.true;
      });

      it('should return a json with the tasks', async () => {
        expect(response.json.calledWith({ tasks })).to.be.true;
      });
    });
  });

  describe('create', () => {
    describe('on success', () => {
      const task = mockData.tasks[0];
      const { _id: id, email } = mockData.users[0];
      const request = {};
      const response = {};

      before(async () => {
        request.user = { id, email };
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
    const { _id: taskId, ...task } = mockData.tasks[0];
    const { users } = mockData;

    describe('when another user tries to remove the task', () => {
      const { _is: userId, email } = users[1];
      const errorObject = errors.tasks.ownership;
      const request = {};
      const response = {};
      const next = sinon.spy();

      before(async () => {
        request.user = { id: userId, email };
        request.params = { id: taskId };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'remove').resolves(errorObject);

        await taskController.remove(request, response, next);
      });

      after(() => {
        taskService.remove.restore();
      });

      it('should call "next"', async () => {
        expect(next.calledOnce).to.be.true;
      });

      it('should call "next" with the task not found error object', async () => {
        expect(next.calledWith(errorObject)).to.be.true;
      });
    });

    describe('when task does not exist', () => {
      const { id: userId, email } = users[0];
      const errorObject = errors.tasks.notFound;
      const request = {};
      const response = {};
      const next = sinon.spy();

      before(async () => {
        request.user = { id: userId, email };
        request.params = { id: taskId };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'remove').resolves(errorObject);

        await taskController.remove(request, response, next);
      });

      after(() => {
        taskService.remove.restore();
      });

      it('should call "next"', async () => {
        expect(next.calledOnce).to.be.true;
      });

      it('should call "next" with the task not found error object', async () => {
        expect(next.calledWith(errorObject)).to.be.true;
      });
    });

    describe('on success', () => {
      const { _id: userId } = users[0];
      const request = {};
      const response = {};

      before(async () => {
        request.user = { id: userId };
        request.params = { id: taskId };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'remove').resolves({ _id: taskId, ...task });

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
    const { _id: id, ...updatedTask } = mockData.tasks[0];
    const { users } = mockData;

    describe('when another user tries to update the task', () => {
      const { _is: userId, email } = users[1];
      const errorObject = errors.tasks.ownership;
      const request = {};
      const response = {};
      const next = sinon.spy();

      before(async () => {
        request.user = { id: userId, email };
        request.params = { id };
        request.body = { ...updatedTask };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'update').resolves(errorObject);

        await taskController.update(request, response, next);
      });

      after(() => {
        taskService.update.restore();
      });

      it('should call "next"', async () => {
        expect(next.calledOnce).to.be.true;
      });

      it('should call "next" with the task not found error object', async () => {
        expect(next.calledWith(errorObject)).to.be.true;
      });
    });

    describe('when task does not exist', () => {
      const { id: userId, email } = users[0];
      const errorObject = errors.tasks.notFound;
      const request = {};
      const response = {};
      const next = sinon.spy();

      before(async () => {
        request.user = { id: userId, email };
        request.params = { id };
        request.body = { ...updatedTask };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'update').resolves(errorObject);

        await taskController.update(request, response, next);
      });

      after(() => {
        taskService.update.restore();
      });

      it('should call "next"', async () => {
        expect(next.calledOnce).to.be.true;
      });

      it('should call "next" with the task not found error object', async () => {
        expect(next.calledWith(errorObject)).to.be.true;
      });
    });

    describe('on success', () => {
      const { _id: userId, email } = users[0];
      const request = {};
      const response = {};

      before(async () => {
        request.user = { id: userId, email };
        request.params = { id };
        request.body = { ...updatedTask };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'update').resolves({ _id: id, ...updatedTask });

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
    const { _id: id, status, ...task } = mockData.tasks[0];
    const { users } = mockData;

    describe('when another user tries to update the task status', () => {
      const { _is: userId, email } = users[1];
      const errorObject = errors.tasks.ownership;
      const request = {};
      const response = {};
      const next = sinon.spy();

      before(async () => {
        request.user = { id: userId, email };
        request.params = { id };
        request.body = { status };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'update').resolves(errorObject);

        await taskController.patchStatus(request, response, next);
      });

      after(() => {
        taskService.update.restore();
      });

      it('should call "next"', async () => {
        expect(next.calledOnce).to.be.true;
      });

      it('should call "next" with the task not found error object', async () => {
        expect(next.calledWith(errorObject)).to.be.true;
      });
    });

    describe('when task does not exist', () => {
      const { id: userId, email } = users[0];
      const errorObject = errors.tasks.notFound;
      const request = {};
      const response = {};
      const next = sinon.spy();

      before(async () => {
        request.user = { id: userId, email };
        request.params = { id };
        request.body = { status };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'update').resolves(errorObject);

        await taskController.patchStatus(request, response, next);
      });

      after(() => {
        taskService.update.restore();
      });

      it('should call "next"', async () => {
        expect(next.calledOnce).to.be.true;
      });

      it('should call "next" with the task not found error object', async () => {
        expect(next.calledWith(errorObject)).to.be.true;
      });
    });

    describe('on success', () => {
      const { _id: userId, email } = users[0];
      const request = {};
      const response = {};

      before(async () => {
        request.user = { id: userId, email };
        request.params = { id };
        request.body = { status };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(taskService, 'update').resolves({ _id: id, status, ...task });

        await taskController.patchStatus(request, response);
      });

      after(() => {
        taskService.update.restore();
      });

      it(`should return status ${statusCodes.ok}`, async () => {
        expect(response.status.calledWith(statusCodes.ok)).to.be.true;
      });

      it('should return a "json" with the updated task', async () => {
        expect(response.json.calledWith({ _id: id, status, ...task })).to.be.true;
      });
    });
  });
});

describe('userController', () => {
  describe('create', () => {
    describe('on failure', () => {
      const { _id, user } = mockData;
      const errorObject = errors.users.alreadyExists;
      const request = {};
      const response = {};
      const next = sinon.spy();

      before(async () => {
        request.body = { ...user };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(userService, 'create').resolves(errorObject);

        await userController.create(request, response, next);
      });

      after(() => {
        userService.create.restore();
      });

      it('should call "next"', async () => {
        expect(next.calledOnce).to.be.true;
      });

      it('should call "next" with the task not found error object', async () => {
        expect(next.calledWith(errorObject)).to.be.true;
      });
    });

    describe('on success', () => {
      const { _id, ...user } = mockData;
      const request = {};
      const response = {};

      before(async () => {
        request.body = { ...user };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(userService, 'create').resolves({ _id, ...user });

        await userController.create(request, response);
      });

      after(() => {
        userService.create.restore();
      });

      it(`should return status ${statusCodes.created}`, async () => {
        expect(response.status.calledWith(statusCodes.created)).to.be.true;
      });

      it('should return a "json" with the user object', async () => {
        expect(response.json.calledWith({ _id, ...user })).to.be.true;
      });
    });
  });

  describe('signin', () => {
    describe('on failure', () => {
      const { _id, user } = mockData;
      const errorObject = errors.users.invalidData;
      const request = {};
      const response = {};
      const next = sinon.spy();

      before(async () => {
        request.body = { ...user };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(userService, 'signin').resolves(errorObject);

        await userController.signin(request, response, next);
      });

      after(() => {
        userService.signin.restore();
      });

      it('should call "next"', async () => {
        expect(next.calledOnce).to.be.true;
      });

      it('should call "next" with the task not found error object', async () => {
        expect(next.calledWith(errorObject)).to.be.true;
      });
    });

    describe('on success', () => {
      const { _id, ...user } = mockData;
      const request = {};
      const response = {};

      before(async () => {
        request.body = { ...user };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(userService, 'signin').resolves({ _id, ...user });
        sinon.stub(jwt, 'sign').returns('token');

        await userController.signin(request, response);
      });

      after(() => {
        userService.signin.restore();
        jwt.sign.restore();
      });

      it(`should return status ${statusCodes.ok}`, async () => {
        expect(response.status.calledWith(statusCodes.ok)).to.be.true;
      });

      it('should return a "json" with the token', async () => {
        expect(response.json.calledWith({ token: 'token' })).to.be.true;
      });
    });
  });
});
