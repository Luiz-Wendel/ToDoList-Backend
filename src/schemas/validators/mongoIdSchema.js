const Joi = require('joi');

const idLength = 24;

module.exports = Joi.object({
  id: Joi.string()
    .hex()
    .min(idLength)
    .max(idLength)
    .required(),
});
