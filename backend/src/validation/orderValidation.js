const Joi = require("joi");
const mongoose = require("mongoose");

const orderItemSchema = Joi.object({
  product_id: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "string.empty": "Product ID is required",
      "any.invalid": "Please provide a valid product ID",
    }),
  quantity: Joi.number().required().min(1).messages({
    "number.base": "Quantity must be a number",
    "number.empty": "Quantity is required",
    "number.min": "Quantity must be at least 1",
  }),
  price: Joi.number().required().min(0).messages({
    "number.base": "Price must be a number",
    "number.empty": "Price is required",
    "number.min": "Price cannot be negative",
  }),
});

const orderSchema = Joi.object({
  customerName: Joi.string().required().min(2).max(100).trim().messages({
    "string.empty": "Customer name is required",
    "string.min": "Customer name must be at least 2 characters long",
    "string.max": "Customer name cannot exceed 100 characters",
  }),

  customerPhoneNumber: Joi.string()
    .required()
    .pattern(/^[0-9+\-\s()]+$/)
    .min(8)
    .max(20)
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Please provide a valid phone number",
      "string.min": "Phone number must be at least 8 characters long",
      "string.max": "Phone number cannot exceed 20 characters",
    }),

  pickupDate: Joi.date().required().min("now").messages({
    "date.base": "Please provide a valid date",
    "date.min": "Pickup date cannot be in the past",
  }),

  pickupTime: Joi.string()
    .required()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      "string.empty": "Pickup time is required",
      "string.pattern.base": "Please provide a valid time in HH:MM format",
    }),

  status: Joi.string()
    .required()
    .valid("payed", "ready", "notready")
    .default("notready")
    .messages({
      "any.only": "Status must be either payed, ready, or notready",
    }),

  orderContent: Joi.array().items(orderItemSchema).min(1).required().messages({
    "array.min": "Order must contain at least one item",
    "array.base": "Order content is required",
  }),

  totalPrice: Joi.number().min(0).required().messages({
    "number.base": "Total price must be a number",
    "number.min": "Total price cannot be negative",
  }),

  description: Joi.string().allow("").max(500).messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
});

const validateOrder = (data) => {
  return orderSchema.validate(data, { abortEarly: false });
};

module.exports = validateOrder;
