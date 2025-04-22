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

const orderValidationSchema = Joi.object({
  customerName: Joi.string().required().messages({
    "string.empty": "Le nom du client est requis",
    "any.required": "Le nom du client est requis",
  }),
  customerPhoneNumber: Joi.string().required().messages({
    "string.empty": "Le numéro de téléphone est requis",
    "any.required": "Le numéro de téléphone est requis",
  }),
  pickupDate: Joi.date().required().messages({
    "date.base": "La date de retrait doit être une date valide",
    "any.required": "La date de retrait est requise",
  }),
  pickupTime: Joi.string().required().messages({
    "string.empty": "L'heure de retrait est requise",
    "any.required": "L'heure de retrait est requise",
  }),
  status: Joi.string()
    .valid("notready", "ready", "payed")
    .default("notready")
    .messages({
      "string.empty": "Le statut est requis",
      "any.only": "Le statut doit être 'notready', 'ready' ou 'payed'",
    }),
  orderContent: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.string().required(),
        quantity: Joi.number().required().min(1),
        price: Joi.number(),
      })
    )
    .required()
    .messages({
      "array.base": "Le contenu de la commande doit être un tableau",
      "any.required": "Le contenu de la commande est requis",
    }),
  totalPrice: Joi.number().required().min(0).messages({
    "number.base": "Le prix total doit être un nombre",
    "number.min": "Le prix total ne peut pas être négatif",
    "any.required": "Le prix total est requis",
  }),
  description: Joi.string().allow("").optional(),
  hasAdvancePayment: Joi.boolean().default(false),
  advanceAmount: Joi.number().when("hasAdvancePayment", {
    is: true,
    then: Joi.number().required().min(0).messages({
      "number.base": "Le montant de l'accompte doit être un nombre",
      "number.min": "Le montant de l'accompte ne peut pas être négatif",
      "any.required":
        "Le montant de l'accompte est requis quand il y a un accompte",
    }),
    otherwise: Joi.number().default(0),
  }),
  remainingAmount: Joi.number().min(0).default(0).messages({
    "number.base": "Le montant restant doit être un nombre",
    "number.min": "Le montant restant ne peut pas être négatif",
  }),
});

const validateOrder = (data) => {
  return orderValidationSchema.validate(data, { abortEarly: false });
};

module.exports = validateOrder;
