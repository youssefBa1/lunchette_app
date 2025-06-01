const User = require("../models/Users");
const userValidation = require("../validation/userValidation");

class UserController {
  async createUser(req, res) {
    try {
      const { error } = userValidation.validate(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      // Check if username or email already exists
      const existingUser = await User.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Username or email already exists",
        });
      }

      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error creating user", error: err.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { error } = userValidation.validate(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      // Check if username or email already exists for other users
      const existingUser = await User.findOne({
        _id: { $ne: req.params.id },
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Username or email already exists",
        });
      }

      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating user", error: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error deleting user", error: err.message });
    }
  }

  async updateUserRole(req, res) {
    try {
      const { role } = req.body;

      if (!["owner", "worker"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating user role", error: err.message });
    }
  }
}

module.exports = new UserController();
