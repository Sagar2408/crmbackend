const nodemailer = require("nodemailer");
require("dotenv").config();

// Create the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a welcome email to a newly signed-up executive.
 * @param {string} toEmail - The executive's email address.
 * @param {string} executiveName - The executive's full name.
 */
const sendExecutiveSignupEmail = async (toEmail, executiveName) => {
  if (!toEmail || !executiveName) {
    return { success: false, message: "Email and name are required." };
  }

  const mailOptions = {
    from: `"Your Company HR" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Welcome to the Team, ${executiveName}!`,
    html: `
      <h3>Dear ${executiveName},</h3>
      <p>We’re thrilled to welcome you as a new executive at our company.</p>
      <p>You now have access to your executive dashboard and tools.</p>
      <p>If you have any questions, feel free to reach out to your manager or HR.</p>
      <br/>
      <p>Best Regards,<br>Team HR</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Signup email sent:", info.response);
    return { success: true, message: "Signup email sent." };
  } catch (error) {
    console.error("Error sending signup email:", error);
    return { success: false, message: "Failed to send signup email." };
  }
};

module.exports = { sendExecutiveSignupEmail };
