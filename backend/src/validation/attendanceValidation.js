const Joi = require("joi");

const attendanceValidationSchema = Joi.object({
  employee: Joi.string().required().messages({
    "string.empty": "L'identifiant de l'employé est requis",
    "any.required": "L'identifiant de l'employé est requis",
  }),

  date: Joi.date().required().messages({
    "date.base": "La date doit être une date valide",
    "any.required": "La date est requise",
  }),

  status: Joi.string()
    .valid("present", "absent", "half-day", "late")
    .required()
    .messages({
      "string.empty": "Le statut est requis",
      "any.only":
        "Le statut doit être 'present', 'absent', 'half-day' ou 'late'",
      "any.required": "Le statut est requis",
    }),

  checkInTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.empty": "L'heure d'arrivée est requise",
      "string.pattern.base":
        "L'heure d'arrivée doit être au format HH:MM (ex: 09:00)",
      "any.required": "L'heure d'arrivée est requise",
    }),

  checkOutTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .allow(null)
    .messages({
      "string.pattern.base":
        "L'heure de départ doit être au format HH:MM (ex: 17:00)",
    }),

  workHours: Joi.number().min(0).default(0).messages({
    "number.base": "Les heures de travail doivent être un nombre",
    "number.min": "Les heures de travail ne peuvent pas être négatives",
  }),

  notes: Joi.string().allow("").max(500).messages({
    "string.max": "Les notes ne peuvent pas dépasser 500 caractères",
  }),
});

module.exports = attendanceValidationSchema;
