const Joi = require('joi');

const minimalPasswordLength = 6;

module.exports = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(minimalPasswordLength)
    .required(),
});
