const mongoose = require("mongoose");

const supplierExpenseItemSchema = new mongoose.Schema({
  categoryItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExpenseCategoryItem",
    required: true,
  },
  amount: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: mongoose.Types.Decimal128,
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: "Price must be a positive number",
    },
  },
});

const supplierExpenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    expenseItems: [
      {
        categoryItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ExpenseCategoryItem",
          required: true,
        },
        amount: {
          type: String,
          required: true,
        },
        price: {
          type: mongoose.Schema.Types.Decimal128,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: mongoose.Types.Decimal128,
      required: true,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: "Total price must be a positive number",
      },
    },
    paymentStatus: {
      type: String,
      enum: ["fully_paid", "partially_paid"],
      required: true,
    },
    amountPaid: {
      type: mongoose.Types.Decimal128,
      required: true,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: "Amount paid must be a positive number",
      },
    },
    restToBePaid: {
      type: mongoose.Types.Decimal128,
      required: true,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: "Rest to be paid must be a positive number",
      },
    },
    paymentHistory: [
      {
        amount: {
          type: mongoose.Schema.Types.Decimal128,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        time: {
          type: String,
          required: true,
        },
      },
    ],
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to get the expense category through category item
supplierExpenseSchema.virtual("categories", {
  ref: "ExpenseCategoryItem",
  localField: "expenseItems.categoryItem",
  foreignField: "_id",
});

// Enable virtuals in JSON
supplierExpenseSchema.set("toJSON", { virtuals: true });
supplierExpenseSchema.set("toObject", { virtuals: true });

const SupplierExpense = mongoose.model(
  "SupplierExpense",
  supplierExpenseSchema
);

module.exports = SupplierExpense;
