const Product = require("../models/Product");
const Category = require("../models/Category");
const validateProduct = require("../validation/productValidation");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
    }).populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  // Validate request body
  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.details.map((detail) => detail.message),
    });
  }

  // Check if category exists
  try {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      category: req.body.category,
      isAvailable: req.body.isAvailable,
    });

    const newProduct = await product.save();
    await newProduct.populate("category", "name");
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  // Validate request body
  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.details.map((detail) => detail.message),
    });
  }

  try {
    // Check if category exists
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name;
    product.price = req.body.price;
    product.imageUrl = req.body.imageUrl;
    product.category = req.body.category;
    product.isAvailable = req.body.isAvailable;

    const updatedProduct = await product.save();
    await updatedProduct.populate("category", "name");
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add many products at once
exports.createManyProducts = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products)) {
      return res
        .status(400)
        .json({ message: "Request body must be an array of products" });
    }

    // Validate each product
    for (const product of products) {
      const { error } = validateProduct(product);
      if (error) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
          product: product,
        });
      }
    }

    const createdProducts = await Product.insertMany(products);
    res.status(201).json(createdProducts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
