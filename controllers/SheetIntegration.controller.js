const { google } = require("googleapis");
const { getTenantDB } = require("../config/sequelizeManager");
const { OAuth2Client } = require("google-auth-library");

// 🔐 Create OAuth2 client
function getOAuthClient() {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// 🌐 Step 1: Handle OAuth callback & store tokens
exports.oauthCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const companyId = req.headers["x-company-id"];
    const adminId = req.user.id;

    const oAuth2Client = getOAuthClient();
    const { tokens } = await oAuth2Client.getToken(code);

    const db = await getTenantDB(companyId);

    await db.SheetIntegration.upsert({
      adminId,
      companyId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiry: tokens.expiry_date,
    });

    res.status(200).json({
      success: true,
      message: "Google account connected successfully",
    });
  } catch (error) {
    console.error("❌ OAuth Callback Error:", error);
    res.status(500).json({ success: false, message: "OAuth failed" });
  }
};

// 🔁 Token refresh helper
async function getAuthenticatedClient(db, companyId) {
  const integration = await db.SheetIntegration.findOne({ where: { companyId } });
  if (!integration) throw new Error("Sheet not integrated");

  const oAuth2Client = getOAuthClient();
  oAuth2Client.setCredentials({
    refresh_token: integration.refreshToken,
  });

  // Get new access token
  const { credentials } = await oAuth2Client.refreshAccessToken();
  integration.accessToken = credentials.access_token;
  integration.tokenExpiry = credentials.expiry_date;
  await integration.save();

  oAuth2Client.setCredentials({ access_token: credentials.access_token });
  return { oAuth2Client, sheetId: integration.sheetId };
}

// ✅ Save manually selected Sheet ID (if needed)
exports.saveSheetId = async (req, res) => {
  try {
    const { sheetId } = req.body;
    const companyId = req.headers["x-company-id"];
    const adminId = req.user.id;

    const db = await getTenantDB(companyId);
    const integration = await db.SheetIntegration.findOne({ where: { companyId } });

    if (!integration) {
      return res.status(400).json({ message: "Integration not found" });
    }

    integration.sheetId = sheetId;
    await integration.save();

    res.status(200).json({ success: true, message: "Sheet ID saved" });
  } catch (error) {
    console.error("❌ Save sheet ID error:", error);
    res.status(500).json({ success: false, message: "Failed to save sheet ID" });
  }
};

// ✅ Import data from Sheet to DB
exports.importClientLeads = async (req, res) => {
  try {
    const companyId = req.headers["x-company-id"];
    const db = await getTenantDB(companyId);
    const { oAuth2Client, sheetId } = await getAuthenticatedClient(db, companyId);

    if (!sheetId) {
      return res.status(400).json({ message: "Sheet ID not selected yet." });
    }

    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1",
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return res.status(400).json({ message: "No data in sheet." });
    }

    const headers = rows[0].map(h => h.trim().toLowerCase());
    const allowedFields = [
      "name", "email", "phone", "education", "experience",
      "state", "country", "dob", "leadassigndate",
      "countrypreference", "assignedtoexecutive", "status"
    ];

    const leads = rows.slice(1).map(row => {
      const lead = {};
      headers.forEach((h, i) => {
        if (allowedFields.includes(h)) {
          lead[h] = row[i] || null;
        }
      });
      return lead;
    });

    const filteredLeads = leads.filter(l => l.name);
    if (!filteredLeads.length) {
      return res.status(400).json({ message: "No valid leads found." });
    }

    const result = await db.ClientLead.bulkCreate(filteredLeads, { ignoreDuplicates: true });

    res.status(200).json({
      success: true,
      message: `${result.length} leads imported successfully`,
    });
  } catch (error) {
    console.error("❌ Failed to import leads:", error);
    res.status(500).json({ success: false, message: "Import failed" });
  }
};
