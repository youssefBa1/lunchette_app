const mongoose = require("mongoose");
const Supplier = require("../models/Supplier");

// Get all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate({
        path: "unpaidExpenses",
        select: "restToBePaid paymentStatus",
      })
      .sort({ name: 1 });

    // Format the response to include totalAmountOwed
    const formattedSuppliers = suppliers.map((supplier) => ({
      ...supplier.toObject(),
      totalAmountOwed: supplier.totalAmountOwed,
    }));

    res.json(formattedSuppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single supplier
exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate({
      path: "unpaidExpenses",
      select: "restToBePaid paymentStatus",
    });

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Format the response to include totalAmountOwed
    const formattedSupplier = {
      ...supplier.toObject(),
      totalAmountOwed: supplier.totalAmountOwed,
    };

    res.json(formattedSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new supplier
exports.createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const savedSupplier = await supplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a supplier
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    Object.assign(supplier, req.body);
    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    await supplier.deleteOne();
    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update supplier debt amount
exports.updateDebtAmount = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const { amount } = req.body;
    if (amount === undefined) {
      return res.status(400).json({ message: "Amount is required" });
    }

    supplier.debtAmount = mongoose.Types.Decimal128.fromString(
      amount.toString()
    );
    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
