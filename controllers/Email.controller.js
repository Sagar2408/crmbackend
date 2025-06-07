const nodemailer = require("nodemailer");
require("dotenv").config();

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (req, res) => {
  const {
    executiveEmail,
    executiveName,
    clientEmail,
    emailBody,
    emailSubject,
  } = req.body;

  if (!executiveEmail || !clientEmail) {
    return res.status(400).json({
      success: false,
      message: "Missing Email Address",
    });
  }
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail(executiveEmail) || !isValidEmail(clientEmail)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  const mailOptions = {
    from: executiveEmail,
    to: clientEmail,
    subject: emailSubject || "Greetings from " + executiveName,
    text:
      emailBody ||
      "Hello! We just wanted to say hi and hope you're doing well!",
    replyTo: executiveEmail,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: "Email Sent Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
