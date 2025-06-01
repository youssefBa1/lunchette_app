const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create a new user
router.post("/register", userController.createUser);

// Login user
router.post("/login", userController.login);

// Get current user profile
router.get("/profile/me", userController.getCurrentUser);

// Update current user profile
router.put("/profile/me", userController.updateCurrentUser);

// Get all users
router.get("/", userController.getUsers);

// Get user by ID
router.get("/:id", userController.getUserById);

// Update user
router.put("/:id", userController.updateUser);

// Delete user
router.delete("/:id", userController.deleteUser);

// Update user role
router.put("/:id/role", userController.updateUserRole);

module.exports = router;
