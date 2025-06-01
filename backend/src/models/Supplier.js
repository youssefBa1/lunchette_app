const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    debtAmount: {
      type: mongoose.Types.Decimal128,
      default: 0,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: "Debt amount must be a positive number",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for unpaid expenses
supplierSchema.virtual("unpaidExpenses", {
  ref: "SupplierExpense",
  localField: "_id",
  foreignField: "supplier",
  match: { paymentStatus: "partially_paid" },
});

// Virtual for total amount owed
supplierSchema.virtual("totalAmountOwed").get(function () {
  if (!this.unpaidExpenses) return 0;
  return this.unpaidExpenses.reduce((sum, expense) => {
    return sum + parseFloat(expense.restToBePaid.toString());
  }, 0);
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
