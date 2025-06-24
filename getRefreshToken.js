require("dotenv").config();
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const code = process.env.GOOGLE_AUTH_CODE;

async function getToken() {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("✅ Access Token:", tokens.access_token);
    console.log("🔁 Refresh Token:", tokens.refresh_token);
  } catch (err) {
    console.error("❌ Error getting tokens:", err.message);
  }
}

getToken();
