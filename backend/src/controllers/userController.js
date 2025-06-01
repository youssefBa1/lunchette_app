const User = require("../models/Users");
const userValidation = require("../validation/userValidation");

class UserController {
  // ... existing code ...

  async getCurrentUser(req, res) {
    try {
      // Assuming user ID is stored in req.user after authentication
      const user = await User.findById(req.user._id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching user profile", error: err.message });
    }
  }

  async updateCurrentUser(req, res) {
    try {
      const { username, email, currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Validate current password if changing password
      if (newPassword) {
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          return res
            .status(401)
            .json({ message: "Current password is incorrect" });
        }
        user.password = newPassword;
      }

      // Update other fields if provided
      if (username) user.username = username;
      if (email) user.email = email;

      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      res.json(userResponse);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating user profile", error: err.message });
    }
  }
}

module.exports = new UserController();
