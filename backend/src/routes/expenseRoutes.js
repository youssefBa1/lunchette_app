const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

// Expense Category routes
router.get("/categories", expenseController.getAllExpenseCategories);
router.post("/categories", expenseController.createExpenseCategory);

// Expense Category Item routes
router.get("/category-items", expenseController.getAllExpenseCategoryItems);
router.post("/category-items", expenseController.createExpenseCategoryItem);

// Expense routes
router.get("/", expenseController.getAllExpenses);
router.post("/", expenseController.createExpense);
router.get("/date-range", expenseController.getExpensesByDateRange);
router.put("/:id", expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;
