const express = require("express");
const router = express.Router();
const RegularSale = require("../models/RegularSale");

// Get all regular sales
router.get("/", async (req, res) => {
  try {
    const regularSales = await RegularSale.find()
      .populate("orderContent.product")
      .sort({ date: -1, time: -1 });
    res.json(regularSales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get regular sales by date
router.get("/date/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const regularSales = await RegularSale.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("orderContent.product")
      .sort({ time: -1 });

    res.json(regularSales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new regular sale
router.post("/", async (req, res) => {
  try {
    const regularSale = new RegularSale(req.body);
    const savedSale = await regularSale.save();
    const populatedSale = await RegularSale.findById(savedSale._id).populate(
      "orderContent.product"
    );
    res.status(201).json(populatedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a regular sale
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSale = await RegularSale.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("orderContent.product");

    if (!updatedSale) {
      return res.status(404).json({ message: "Regular sale not found" });
    }

    res.json(updatedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a regular sale
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSale = await RegularSale.findByIdAndDelete(id);

    if (!deletedSale) {
      return res.status(404).json({ message: "Regular sale not found" });
    }

    res.json({ message: "Regular sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update sale status
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedSale = await RegularSale.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("orderContent.product");

    if (!updatedSale) {
      return res.status(404).json({ message: "Regular sale not found" });
    }

    res.json(updatedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
