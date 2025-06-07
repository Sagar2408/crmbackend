const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupHr = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const Hr = req.db.Hr;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingHr = await Hr.findOne({ where: { email } });
    if (existingHr) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hr = await Hr.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "HR registered successfully.",
      hr: {
        id: hr.id,
        name: hr.name,
        email: hr.email,
      },
    });
  } catch (err) {
    console.error("HR Signup error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const loginHr = async (req, res) => {
  try {
    const { email, password } = req.body;
    const Hr = req.db.Hr;

    const hr = await Hr.findOne({ where: { email } });
    if (!hr) {
      return res.status(404).json({ error: "HR not found." });
    }

    const isMatch = await bcrypt.compare(password, hr.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      {
        id: hr.id,
        email: hr.email,
        name: hr.name,
        role: hr.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.cookie("hr_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 12 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful.",
      token,
      hr: {
        id: hr.id,
        email: hr.email,
        name: hr.name,
        role: hr.role,
      },
    });
  } catch (err) {
    console.error("HR Login error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  signupHr,
  loginHr,
};
