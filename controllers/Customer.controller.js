const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const Customer = req.db.Customer; // Dynamically selected table for Customer

    // Find the customer by email and check if the status is "approved"
    const customer = await Customer.findOne({
      where: { email },
    });

    if (!customer) {
      return res
        .status(404)
        .json({ message: "Customer not found or not approved" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        id: customer.id,
        email: customer.email,
        fullName: customer.fullName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 12 * 60 * 60 * 1000, // Token expires in 12 hours
    });

    res.status(200).json({
      message: "Login successful",
      token,
      customer: {
        id: customer.id,
        email: customer.email,
        fullName: customer.fullName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signupCustomer = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const Customer = req.db.Customer; // Dynamically selected table for Customer

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        error: "Full Name, Email, and Password are required fields.",
      });
    }

    // Validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if the email already exists
    const existingCustomer = await Customer.findOne({ where: { email } });

    if (existingCustomer) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer with status as "pending" by default
    const customer = await Customer.create({
      fullName,
      email,
      password: hashedPassword,
      status: "pending", // Default status
    });

    return res.status(201).json({
      message: "Customer created successfully",
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        status: customer.status,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    let errorMessage = "Internal server error";
    if (error.name === "SequelizeValidationError") {
      errorMessage = error.errors.map((e) => e.message).join(", ");
    } else if (error.name === "SequelizeUniqueConstraintError") {
      errorMessage = "Email already exists";
    }
    return res.status(500).json({ error: errorMessage });
  }
};

const logoutCustomer = async (req, res) => {
  try {
    const Customer = req.db.Customer; // ✅ Use dynamic tenant database
    const customerId = req.user.id; // Assumes authentication middleware adds `req.user`

    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  loginCustomer,
  signupCustomer,
  logoutCustomer,
};
