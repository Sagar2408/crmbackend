const { google } = require("googleapis");

// ✅ Yahan apna code paste kar jo Google ne URL ke baad diya tha
const code = "4/0AUJR-x6ss4HipNKfpwD2V6F_WYVB304prEmdJ-RJl27AvQVFXl_uuZnQ75t5QjdDk0sFgg";

const oAuth2Client = new google.auth.OAuth2(
  "614898504214-i6lb82gcs1h1d1lh2i1i232bcet2v7c6.apps.googleusercontent.com",
  "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",
  "https://crmbackend-yho0.onrender.com/oauth/google/callback"
);

async function getToken() {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("✅ Access Token:", tokens.access_token);
    console.log("🔁 Refresh Token:", tokens.refresh_token);
  } catch (err) {
    console.error("❌ Error getting tokens:", err);
  }
}

getToken();
