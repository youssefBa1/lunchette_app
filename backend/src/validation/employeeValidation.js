const Joi = require("joi");

const employeeValidationSchema = Joi.object({
  name: Joi.string().required().min(2).max(50).messages({
    "string.empty": "Le nom est requis",
    "string.min": "Le nom doit contenir au moins 2 caractères",
    "string.max": "Le nom ne peut pas dépasser 50 caractères",
    "any.required": "Le nom est requis",
  }),

  phoneNumber: Joi.string()
    .required()
    .pattern(/^[0-9+\-\s()]+$/)
    .messages({
      "string.empty": "Le numéro de téléphone est requis",
      "string.pattern.base": "Veuillez fournir un numéro de téléphone valide",
      "any.required": "Le numéro de téléphone est requis",
    }),

  salaryType: Joi.string()
    .valid("daily", "weekly", "monthly")
    .required()
    .messages({
      "string.empty": "Le type de salaire est requis",
      "any.only": "Le type de salaire doit être 'daily', 'weekly' ou 'monthly'",
      "any.required": "Le type de salaire est requis",
    }),

  employeeType: Joi.string().valid("regular", "backup").required().messages({
    "string.empty": "Le type d'employé est requis",
    "any.only": "Le type d'employé doit être 'regular' ou 'backup'",
    "any.required": "Le type d'employé est requis",
  }),

  baseSalary: Joi.number().required().min(0).messages({
    "number.base": "Le salaire de base doit être un nombre",
    "number.min": "Le salaire de base ne peut pas être négatif",
    "any.required": "Le salaire de base est requis",
  }),

  isActive: Joi.boolean().default(true),

  shiftStart: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .default("09:00")
    .messages({
      "string.pattern.base":
        "L'heure de début doit être au format HH:MM (ex: 09:00)",
    }),

  shiftEnd: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .default("17:00")
    .messages({
      "string.pattern.base":
        "L'heure de fin doit être au format HH:MM (ex: 17:00)",
    }),

  lateThreshold: Joi.number().min(0).max(60).default(10).messages({
    "number.base": "Le seuil de retard doit être un nombre",
    "number.min": "Le seuil de retard ne peut pas être négatif",
    "number.max": "Le seuil de retard ne peut pas dépasser 60 minutes",
  }),
});

module.exports = employeeValidationSchema;
