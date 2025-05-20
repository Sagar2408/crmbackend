const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const Manager = req.db.Manager;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingManager = await Manager.findOne({ where: { email } });
    if (existingManager) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const manager = await Manager.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Manager registered successfully.",
      manager: {
        id: manager.id,
        name: manager.name,
        email: manager.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const loginManager = async (req, res) => {
  try {
    const { email, password } = req.body;
    const Manager = req.db.Manager;

    const manager = await Manager.findOne({ where: { email } });
    if (!manager) {
      return res.status(404).json({ error: "Manager not found." });
    }

    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: manager.id, email: manager.email, name: manager.name },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.cookie("manager_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 12 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful.",
      token,
      manager: {
        id: manager.id,
        email: manager.email,
        name: manager.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const logoutManager = async (req, res) => {
  try {
    res.clearCookie("manager_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const Team = req.db.Team;
    const managerId = req.user.id; // req.user is set by auth middleware

    if (!name) {
      return res.status(400).json({ error: "Team name is required." });
    }

    const team = await Team.create({
      name,
      manager_id: managerId,
    });

    res.status(201).json({
      message: "Team created successfully.",
      team,
    });
  } catch (err) {
    console.error("Create team error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getManagerTeams = async (req, res) => {
  try {
    const Team = req.db.Team;
    const managerId = req.user.id;

    const teams = await Team.findAll({ where: { manager_id: managerId } });

    res.status(200).json({ teams });
  } catch (err) {
    console.error("Get teams error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  signupManager,
  loginManager,
  logoutManager,
  createTeam,
  getManagerTeams,
};
