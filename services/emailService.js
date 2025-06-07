const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Corrected variable name
    pass: process.env.EMAIL_PASS, // Corrected variable name
  },
});

// Function to send emails
const sendEmail = async (to, username, resetToken) => {
  try {
    const mailOptions = {
      from: `"Your App Support" <${process.env.EMAIL_USER}>`, // Corrected "from" field
      to: to, // Use parameter instead of user.email
      subject: "Reset Your Password - YourApp",
      text: `Hello ${username},\n\nClick the link below to reset your password:\n\n${process.env.FRONTEND_URL}/reset-password?token=${resetToken}\n\nThis link expires in 1 hour.\n\nIf you didn’t request this, you can ignore this email.`,
      html: `
        <p>Hello ${username},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" target="_blank">Reset Password</a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn’t request this, you can ignore this email.</p>
        <p>Best Regards,<br>Your App Support</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
};

const sendTeamAssignmentEmail = async (to, executiveName, teamName, managerName) => {
  try {
    const mailOptions = {
      from: `"Your App Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: `You've been added to a team: ${teamName}`,
      text: `Hello ${executiveName},\n\nYou have been added to the team "${teamName}" by manager "${managerName}".\n\nPlease log in to your dashboard to get started.\n\nBest regards,\nYour App Team`,
      html: `
        <p>Hello ${executiveName},</p>
        <p>You have been added to the team <strong>${teamName}</strong> by manager <strong>${managerName}</strong>.</p>
        <p>Please log in to your dashboard to get started.</p>
        <p>Best Regards,<br>Your App Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Team assignment email sent: " + info.response);
    return { success: true, message: "Team assignment email sent successfully" };
  } catch (error) {
    console.error("Error sending team assignment email:", error);
    return { success: false, message: "Failed to send team assignment email" };
  }
};

module.exports = { sendEmail , sendTeamAssignmentEmail, };
