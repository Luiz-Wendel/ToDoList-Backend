const UserModel = require('../models/UserModel');

const errors = require('../schemas/errorsSchema');

module.exports = {
  create: async ({ email, password }) => {
    const alreadyExists = await UserModel.findByEmail(email);

    if (alreadyExists) return errors.users.alreadyExists;

    const insertedId = await UserModel.create({ email, password });

    return { _id: insertedId, email, password };
  },
};
