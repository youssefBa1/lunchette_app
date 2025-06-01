const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const userRoutes = require("../routes/userRoutes");

// Routes
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const presenceRoutes = require("./routes/presenceRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const supplierRoutes = require("./routes/supplier");
const supplierExpenseRoutes = require("./routes/supplierExpense");
const regularSalesRoutes = require("./routes/regularSales");
const statsRoutes = require("./routes/stats");

// Load environment variables
dotenv.config();

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lunchette", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Session Configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/presence", presenceRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/supplier-expenses", supplierExpenseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/regular-sales", regularSalesRoutes);
app.use("/api/stats", statsRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Lunchette API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
