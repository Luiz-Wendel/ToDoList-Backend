const Joi = require('joi');

const minimalDescriptionLength = 3;

module.exports = Joi.object({
  description: Joi.string()
    .min(minimalDescriptionLength)
    .required(),

  status: Joi.string()
    .pattern(/^(Pending|In progress|Done)$/)
    .required()
    .messages({
      'string.pattern.base': 'Should be one of the following: "Pending", "In progress" or "Done"',
    }),
});
