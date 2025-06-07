const { MasterUser } = require("../config/masterSequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/*-----------------------Master User Signup---------------------*/
const signupMasterUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 🚫 Restrict signup if a master user already exists
    const existing = await MasterUser.findOne();
    if (existing) {
      return res
        .status(403)
        .json({ error: "Master user already exists. Signup is disabled." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await MasterUser.create({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Master user created successfully",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Master user signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
/*-----------------------Master User Login---------------------*/
const loginMasterUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await MasterUser.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Master user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.MASTER_JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Master user login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/*-----------------------Master User Logout---------------------*/
const logoutMasterUser = (req, res) => {
  try {
    // Access the user ID directly from the `req.masterUser` object (set by authMaster middleware)
    const userId = req.masterUser.id;

    // Clear the token from the cookie (client-side logout)
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      sameSite: "Lax",
    });

    return res.status(200).json({
      message: "Logout successful",
      userId: userId, // Optionally returning the userId in the response
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  signupMasterUser,
  loginMasterUser,
  logoutMasterUser,
};
