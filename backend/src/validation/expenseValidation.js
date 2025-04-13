const Joi = require("joi");

const expenseCategorySchema = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().trim().allow("", null),
});

const expenseCategoryItemSchema = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().trim().allow("", null),
  category: Joi.string().required().hex().length(24),
});

const expenseSchema = Joi.object({
  date: Joi.date().required(),
  time: Joi.string()
    .required()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  categoryItem: Joi.string().required().hex().length(24),
  amount: Joi.number().required().min(0),
  description: Joi.string().trim().allow("", null),
});

module.exports = {
  validateExpenseCategory: (data) => expenseCategorySchema.validate(data),
  validateExpenseCategoryItem: (data) =>
    expenseCategoryItemSchema.validate(data),
  validateExpense: (data) => expenseSchema.validate(data),
};
