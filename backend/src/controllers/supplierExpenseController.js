const mongoose = require("mongoose");
const SupplierExpense = require("../models/SupplierExpense");
const Supplier = require("../models/Supplier");
const ExpenseCategoryItem = require("../models/ExpenseCategoryItem");

// Get all supplier expenses
exports.getAllSupplierExpenses = async (req, res) => {
  try {
    const expenses = await SupplierExpense.find()
      .populate("supplier")
      .populate({
        path: "expenseItems.categoryItem",
        populate: { path: "category" },
      })
      .sort({ date: -1, time: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single supplier expense
exports.getSupplierExpense = async (req, res) => {
  try {
    const expense = await SupplierExpense.findById(req.params.id)
      .populate("supplier")
      .populate({
        path: "expenseItems.categoryItem",
        populate: { path: "category" },
      });

    if (!expense) {
      return res.status(404).json({ message: "Supplier expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new supplier expense
exports.createSupplierExpense = async (req, res) => {
  try {
    // Validate supplier exists
    const supplier = await Supplier.findById(req.body.supplier);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Validate all category items exist
    for (const item of req.body.expenseItems) {
      const categoryItem = await ExpenseCategoryItem.findById(
        item.categoryItem
      );
      if (!categoryItem) {
        return res.status(404).json({
          message: `Category item not found: ${item.categoryItem}`,
        });
      }
    }

    const expense = new SupplierExpense(req.body);

    // Add initial payment to history if amountPaid > 0
    if (parseFloat(req.body.amountPaid) > 0) {
      expense.paymentHistory.push({
        amount: mongoose.Types.Decimal128.fromString(
          req.body.amountPaid.toString()
        ),
        date: new Date(),
        time: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    const savedExpense = await expense.save();

    // Update supplier's debt amount
    supplier.debtAmount = mongoose.Types.Decimal128.fromString(
      (
        parseFloat(supplier.debtAmount.toString()) +
        parseFloat(savedExpense.restToBePaid.toString())
      ).toString()
    );
    await supplier.save();

    // Populate the saved expense with references
    await savedExpense.populate("supplier");
    await savedExpense.populate({
      path: "expenseItems.categoryItem",
      populate: { path: "category" },
    });

    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a supplier expense
exports.updateSupplierExpense = async (req, res) => {
  try {
    const expense = await SupplierExpense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Supplier expense not found" });
    }

    // If payment status or amounts are being updated
    if (
      req.body.paymentStatus ||
      req.body.amountPaid ||
      req.body.restToBePaid
    ) {
      const supplier = await Supplier.findById(expense.supplier);

      // Remove old debt amount
      supplier.debtAmount = mongoose.Types.Decimal128.fromString(
        (
          parseFloat(supplier.debtAmount.toString()) -
          parseFloat(expense.restToBePaid.toString())
        ).toString()
      );

      // Add new debt amount
      supplier.debtAmount = mongoose.Types.Decimal128.fromString(
        (
          parseFloat(supplier.debtAmount.toString()) +
          parseFloat(req.body.restToBePaid || expense.restToBePaid.toString())
        ).toString()
      );

      await supplier.save();
    }

    // Update expense
    Object.assign(expense, req.body);
    const updatedExpense = await expense.save();

    // Populate the updated expense
    await updatedExpense.populate("supplier");
    await updatedExpense.populate({
      path: "expenseItems.categoryItem",
      populate: { path: "category" },
    });

    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a supplier expense
exports.deleteSupplierExpense = async (req, res) => {
  try {
    const expense = await SupplierExpense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Supplier expense not found" });
    }

    // Update supplier's debt amount
    const supplier = await Supplier.findById(expense.supplier);
    supplier.debtAmount = mongoose.Types.Decimal128.fromString(
      (
        parseFloat(supplier.debtAmount.toString()) -
        parseFloat(expense.restToBePaid.toString())
      ).toString()
    );
    await supplier.save();

    await expense.deleteOne();
    res.json({ message: "Supplier expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get supplier expenses by date
exports.getSupplierExpensesByDate = async (req, res) => {
  const { date } = req.params;

  if (!date) {
    return res.status(400).json({
      message: "Date parameter is required",
    });
  }

  try {
    // Set time to start and end of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    if (isNaN(startOfDay.getTime())) {
      return res.status(400).json({
        message: "Invalid date format. Please use YYYY-MM-DD format",
      });
    }

    const expenses = await SupplierExpense.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate("supplier")
      .populate({
        path: "expenseItems.categoryItem",
        populate: { path: "category" },
      })
      .sort({ time: 1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get supplier expenses by date range
exports.getSupplierExpensesByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      message: "Both startDate and endDate query parameters are required",
    });
  }

  try {
    const expenses = await SupplierExpense.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate("supplier")
      .populate({
        path: "expenseItems.categoryItem",
        populate: { path: "category" },
      })
      .sort({ date: -1, time: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new payment to supplier expense
exports.addPayment = async (req, res) => {
  try {
    const expense = await SupplierExpense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Supplier expense not found" });
    }

    const { amount } = req.body;
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res
        .status(400)
        .json({ message: "Valid payment amount is required" });
    }

    const paymentAmount = mongoose.Types.Decimal128.fromString(
      amount.toString()
    );
    const currentAmountPaid = parseFloat(expense.amountPaid.toString());
    const newAmountPaid = currentAmountPaid + parseFloat(amount);
    const totalPrice = parseFloat(expense.totalPrice.toString());
    const newRestToBePaid = totalPrice - newAmountPaid;

    // Add payment to history
    expense.paymentHistory.push({
      amount: paymentAmount,
      date: new Date(),
      time: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    // Update expense payment info
    expense.amountPaid = mongoose.Types.Decimal128.fromString(
      newAmountPaid.toString()
    );
    expense.restToBePaid = mongoose.Types.Decimal128.fromString(
      newRestToBePaid.toString()
    );
    expense.paymentStatus =
      newRestToBePaid === 0 ? "fully_paid" : "partially_paid";

    // Update supplier's debt amount
    const supplier = await Supplier.findById(expense.supplier);
    supplier.debtAmount = mongoose.Types.Decimal128.fromString(
      (
        parseFloat(supplier.debtAmount.toString()) - parseFloat(amount)
      ).toString()
    );
    await supplier.save();

    const updatedExpense = await expense.save();
    await updatedExpense.populate("supplier");
    await updatedExpense.populate({
      path: "expenseItems.categoryItem",
      populate: { path: "category" },
    });

    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
