const Joi = require("joi");

const userValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("owner", "worker").required(),
  isActive: Joi.boolean().required(),
});

module.exports = userValidation;
