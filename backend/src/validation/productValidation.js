const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = Joi.object({
  name: Joi.string().required().min(2).max(100).trim().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 2 characters long",
    "string.max": "Product name cannot exceed 100 characters",
  }),

  price: Joi.number().required().min(0).messages({
    "number.base": "Price must be a number",
    "number.empty": "Price is required",
    "number.min": "Price cannot be negative",
  }),

  imageUrl: Joi.string().uri().allow("").optional().default("").messages({
    "string.uri": "Please provide a valid URL for the image",
  }),

  category: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "string.empty": "Category ID is required",
      "any.invalid": "Please provide a valid category ID",
    }),

  isAvailable: Joi.boolean().default(true),

  description: Joi.string().allow("").default("").optional(),
});

const validateProduct = (data) => {
  return productSchema.validate(data, { abortEarly: false });
};

module.exports = validateProduct;
