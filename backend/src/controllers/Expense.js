const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    categoryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpenseCategoryItem",
      required: true,
    },
    amount: {
      type: mongoose.Types.Decimal128,
      required: true,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: "Amount must be a positive number",
      },
    },
    description: {
      type: String,
      trim: true,
    },
    // New fields for supplier
    isSupplierExpense: {
      type: Boolean,
      default: false,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      // Only required if isSupplierExpense is true
      validate: {
        validator: function (v) {
          return !this.isSupplierExpense || v !== undefined;
        },
        message: "Supplier is required when this is a supplier expense",
      },
    },
    // Payment info
    paymentStatus: {
      type: String,
      enum: ["fully_paid", "partially_paid"],
      // Only required if isSupplierExpense is true
      validate: {
        validator: function (v) {
          return !this.isSupplierExpense || v !== undefined;
        },
        message: "Payment status is required for supplier expenses",
      },
    },
    // Amount actually paid (could be less than the total amount)
    amountPaid: {
      type: mongoose.Types.Decimal128,
      validate: {
        validator: function (v) {
          return v === undefined || v >= 0;
        },
        message: "Amount paid must be a positive number",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to get the expense category through category item
expenseSchema.virtual("category", {
  ref: "ExpenseCategoryItem",
  localField: "categoryItem",
  foreignField: "_id",
  justOne: true,
  populate: {
    path: "category",
    model: "ExpenseCategory",
  },
});

// Virtual to get related supplier transaction
expenseSchema.virtual("supplierTransaction", {
  ref: "SupplierTransaction",
  localField: "_id",
  foreignField: "expense",
  justOne: true,
});

// Enable virtuals in JSON
expenseSchema.set("toJSON", { virtuals: true });
expenseSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Expense", expenseSchema);
