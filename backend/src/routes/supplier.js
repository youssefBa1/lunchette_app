const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/Supplier");

// Get all suppliers
router.get("/", supplierController.getAllSuppliers);

// Get a single supplier
router.get("/:id", supplierController.getSupplier);

// Create a new supplier
router.post("/", supplierController.createSupplier);

// Update a supplier
router.put("/:id", supplierController.updateSupplier);

// Delete a supplier
router.delete("/:id", supplierController.deleteSupplier);

// Update supplier debt amount
router.patch("/:id/debt", supplierController.updateDebtAmount);

module.exports = router;
