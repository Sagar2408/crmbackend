const { Op } = require("sequelize");

/*---------------- Update User Login Status ----------------*/
const updateUserLoginStatus = async (req, res) => {
  try {
    const Users = req.db.Users; // ✅ Dynamic database selection
    const { userId, canLogin } = req.body;

    // ✳️ Only Admins are allowed
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Unauthorized: Only Admin can change login access."
      });
    }

    if (typeof userId === "undefined") {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.can_login = !!canLogin;
    await user.save();

    res.status(200).json({
      message: `User login access updated to '${!!canLogin}'`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        can_login: user.can_login,
      },
    });
  } catch (error) {
    console.error("Error updating user login status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/*---------------- Get User Login Status ----------------*/
const getUserLoginStatus = async (req, res) => {
  try {
    const Users = req.db.Users; // ✅ Dynamic database selection
    const { userId } = req.params; // ✅ Fixed: Get from params instead of query
    const { role } = req.user;

    // Access control: Only Admin and TL can fetch user status
    if (role !== "Admin" && role !== "TL") {
      return res.status(403).json({
        message: "Unauthorized: Only Admin and TL can view user status"
      });
    }

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    const user = await Users.findByPk(userId, {
      attributes: ["id", "username", "email", "role", "can_login", "is_online"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User status retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error getting user login status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateUserLoginStatus,
  getUserLoginStatus,
};