# Wellcome to my To Do List Backend project

This is the backend app of the To Do List made for the Career Blitz by Trybe.

With this app you will be able to:
* Create a user;
* Sign in with created user;
* After signed in:
  * Create a task;
  * View all tasks;
  * Update a task;
  * Update a task status;
  * Delete a task.

# Skills

* Node
* Express
* Mocha
* Chai
* Sinon
* Mongo

# How to run the app

## Requirements

* Node: v14.16.0
* npm: 7.5.4

## Steps

* After downloading the app, enter the project folder.
* Run the command `npm ci` to install project dependencies.
* Run the command `npm run dev` to start the development environment.

## Available scripts

### Start

* `npm start`, starts the server.
* `npm run dev`, starts the server in development mode.

### Tests

* `npm test`, run unit tests (mocha).
* `npm run test:coverage`, run tests coverage (nyc).

## Available endpoints

### Users

#### Create a user

  `[POST] /api/users`
  Requires a `body` with the following format: `{ email, password }`.

#### Sign in with created user

  `[POST] /api/users/login`
  Requires a `body` with the following format: `{ email, password }`.

### Tasks

The following endpoints need the `headers` with the following info: `{ Authorization: [jwtTokenHere] }` (jwtToken generated by the signin endpoin)'.

### Create a task

  `[POST] /api/tasks`
  Requires a `body` with the following format: `{ description }`.

### View all tasks

`[GET] /api/tasks`

### Update a task

`[PUT] /api/tasks/:taskId`
  Requires a `body` with the following format: `{ [description], [status] }`.

### Update a task status

`[PATCH] /api/tasks/:taskId/status`
  Requires a `body` with the following format: `{ status }`.

### Delete a task

`[POST] /api/tasks/:taskId`