const Joi = require("joi");

const presenceValidationSchema = Joi.object({
  employee: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "L'identifiant de l'employé est requis",
      "string.pattern.base": "L'identifiant de l'employé n'est pas valide",
      "any.required": "L'identifiant de l'employé est requis",
    }),

  date: Joi.date().required().messages({
    "date.base": "La date doit être une date valide",
    "any.required": "La date est requise",
  }),

  status: Joi.string()
    .valid("present", "absent", "late", "excused")
    .required()
    .messages({
      "string.empty": "Le statut est requis",
      "any.only":
        "Le statut doit être 'present', 'absent', 'late' ou 'excused'",
      "any.required": "Le statut est requis",
    }),

  checkInTime: Joi.when("status", {
    is: Joi.string().valid("present", "late"),
    then: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.empty": "L'heure d'arrivée est requise pour les présences",
        "string.pattern.base":
          "L'heure d'arrivée doit être au format HH:MM (ex: 09:00)",
        "any.required": "L'heure d'arrivée est requise pour les présences",
      }),
    otherwise: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional(),
  }),

  checkOutTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .allow(null)
    .messages({
      "string.pattern.base":
        "L'heure de départ doit être au format HH:MM (ex: 17:00)",
    }),

  totalHours: Joi.number().min(0).default(0).messages({
    "number.base": "Le nombre d'heures doit être un nombre",
    "number.min": "Le nombre d'heures ne peut pas être négatif",
  }),

  notes: Joi.string().allow("").max(500).default("").messages({
    "string.max": "Les notes ne peuvent pas dépasser 500 caractères",
  }),
});

module.exports = presenceValidationSchema;
