const Expense = require("../models/Expense");
const ExpenseCategory = require("../models/ExpenseCategory");
const ExpenseCategoryItem = require("../models/ExpenseCategoryItem");
const {
  validateExpense,
  validateExpenseCategory,
  validateExpenseCategoryItem,
} = require("../validation/expenseValidation");

// Expense Category Controllers
exports.getAllExpenseCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.find().populate("categoryItems");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createExpenseCategory = async (req, res) => {
  const { error } = validateExpenseCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const category = new ExpenseCategory(req.body);
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateExpenseCategory = async (req, res) => {
  const { error } = validateExpenseCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const category = await ExpenseCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    Object.assign(category, req.body);
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteExpenseCategory = async (req, res) => {
  try {
    const category = await ExpenseCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if there are any items using this category
    const itemsCount = await ExpenseCategoryItem.countDocuments({
      category: req.params.id,
    });
    if (itemsCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category because it has associated items. Please delete the items first.",
      });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Expense Category Item Controllers
exports.getAllExpenseCategoryItems = async (req, res) => {
  try {
    const items = await ExpenseCategoryItem.find().populate("category");
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createExpenseCategoryItem = async (req, res) => {
  const { error } = validateExpenseCategoryItem(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const categoryExists = await ExpenseCategory.findById(req.body.category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const item = new ExpenseCategoryItem(req.body);
    const newItem = await item.save();
    await newItem.populate("category");
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateExpenseCategoryItem = async (req, res) => {
  const { error } = validateExpenseCategoryItem(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const item = await ExpenseCategoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Category item not found" });
    }

    if (req.body.category) {
      const categoryExists = await ExpenseCategory.findById(req.body.category);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    Object.assign(item, req.body);
    const updatedItem = await item.save();
    await updatedItem.populate("category");
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteExpenseCategoryItem = async (req, res) => {
  try {
    const item = await ExpenseCategoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Category item not found" });
    }

    await item.deleteOne();
    res.json({ message: "Category item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Expense Controllers
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate({
      path: "categoryItem",
      populate: { path: "category" },
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createExpense = async (req, res) => {
  const { error } = validateExpense(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const categoryItemExists = await ExpenseCategoryItem.findById(
      req.body.categoryItem
    );
    if (!categoryItemExists) {
      return res.status(404).json({ message: "Category item not found" });
    }

    const expense = new Expense(req.body);
    const newExpense = await expense.save();
    await newExpense.populate({
      path: "categoryItem",
      populate: { path: "category" },
    });
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getExpensesByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const expenses = await Expense.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).populate({
      path: "categoryItem",
      populate: { path: "category" },
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  const { error } = validateExpense(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (req.body.categoryItem) {
      const categoryItemExists = await ExpenseCategoryItem.findById(
        req.body.categoryItem
      );
      if (!categoryItemExists) {
        return res.status(404).json({ message: "Category item not found" });
      }
    }

    Object.assign(expense, req.body);
    const updatedExpense = await expense.save();
    await updatedExpense.populate({
      path: "categoryItem",
      populate: { path: "category" },
    });
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    await expense.deleteOne();
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
