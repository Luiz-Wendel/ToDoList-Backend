const Joi = require('joi');

module.exports = Joi.object({
  status: Joi.string()
    .pattern(/^(Pending|In progress|Done)$/)
    .required()
    .messages({
      'string.pattern.base': 'Should be one of the following: "Pending", "In progress" or "Done"',
    }),
});
