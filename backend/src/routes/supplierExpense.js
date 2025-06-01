const express = require("express");
const router = express.Router();
const supplierExpenseController = require("../controllers/supplierExpenseController");

// Get all supplier expenses
router.get("/", supplierExpenseController.getAllSupplierExpenses);

// Get supplier expenses by date
router.get("/date/:date", supplierExpenseController.getSupplierExpensesByDate);

// Get supplier expenses by date range
router.get(
  "/date-range",
  supplierExpenseController.getSupplierExpensesByDateRange
);

// Get a single supplier expense
router.get("/:id", supplierExpenseController.getSupplierExpense);

// Create a new supplier expense
router.post("/", supplierExpenseController.createSupplierExpense);

// Add a payment to supplier expense
router.post("/:id/payment", supplierExpenseController.addPayment);

// Update a supplier expense
router.put("/:id", supplierExpenseController.updateSupplierExpense);

// Delete a supplier expense
router.delete("/:id", supplierExpenseController.deleteSupplierExpense);

module.exports = router;
