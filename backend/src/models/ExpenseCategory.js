const mongoose = require("mongoose");

const expenseCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for getting category items
expenseCategorySchema.virtual("categoryItems", {
  ref: "ExpenseCategoryItem",
  localField: "_id",
  foreignField: "category",
});

// Enable virtuals in JSON
expenseCategorySchema.set("toJSON", { virtuals: true });
expenseCategorySchema.set("toObject", { virtuals: true });

const ExpenseCategory = mongoose.model(
  "ExpenseCategory",
  expenseCategorySchema
);

module.exports = ExpenseCategory;
