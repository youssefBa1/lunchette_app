const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

// Expense Category routes
router.get("/categories", expenseController.getAllExpenseCategories);
router.post("/categories", expenseController.createExpenseCategory);
router.put("/categories/:id", expenseController.updateExpenseCategory);
router.delete("/categories/:id", expenseController.deleteExpenseCategory);

// Expense Category Item routes
router.get("/category-items", expenseController.getAllExpenseCategoryItems);
router.post("/category-items", expenseController.createExpenseCategoryItem);
router.put("/category-items/:id", expenseController.updateExpenseCategoryItem);
router.delete(
  "/category-items/:id",
  expenseController.deleteExpenseCategoryItem
);

// Expense routes
router.get("/", expenseController.getAllExpenses);
router.post("/", expenseController.createExpense);
router.get("/date-range", expenseController.getExpensesByDateRange);
router.put("/:id", expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;
