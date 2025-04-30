const User = require("../models/user.model");

/**
 * @desc Get all users
 * @route GET /api/admin/users
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

/**
 * @desc Delete a user by ID
 * @route DELETE /api/admin/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};

module.exports = {
  getUsers,
  deleteUser,
};
