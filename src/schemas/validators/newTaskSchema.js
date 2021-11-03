const Joi = require('joi');

const minimalLength = 3;

module.exports = Joi.object({
  description: Joi.string()
    .min(minimalLength)
    .required(),
});
