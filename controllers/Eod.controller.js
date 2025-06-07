const nodemailer = require('nodemailer');

const sendEodEmail = async (req, res) => {
  const { email, content } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password (keep secret)
      },
    });

    const mailOptions = {
      from: 'mathurchetanya1@gmail.com',
      to: email,
      subject: 'EOD Report from AtoZee Visas',
      html: `
        <h3>EOD Report</h3>
        <pre style="font-family: monospace; white-space: pre-wrap;">${content}</pre>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("❌ Error sending email:", error);
        return res.status(500).json({ status: 500, error: error.message });
      } else {
        console.log("✅ Email sent:", info.response);
        return res.status(201).json({ message: "Email sent successfully" });
      }
    });

  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ status: 500, error: error.message });
  }
};

module.exports = { sendEodEmail };
