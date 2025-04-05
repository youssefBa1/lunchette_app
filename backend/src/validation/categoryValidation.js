const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().required().min(2).max(50).trim().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters long",
    "string.max": "Category name cannot exceed 50 characters",
  }),

  imageUrl: Joi.string().required().uri().messages({
    "string.empty": "Image URL is required",
    "string.uri": "Please provide a valid URL for the image",
  }),

  description: Joi.string().allow("").max(500).messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
});

const validateCategory = (data) => {
  return categorySchema.validate(data, { abortEarly: false });
};

module.exports = validateCategory;
