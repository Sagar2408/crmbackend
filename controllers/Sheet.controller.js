const { google } = require("googleapis");
const { getTenantDB } = require("../config/sequelizeManager");
const { OAuth2Client } = require("google-auth-library");

function getOAuthClient() {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// ✅ 1. Save Sheet ID
exports.saveSheetId = async (req, res) => {
  try {
    const { sheetId } = req.body;
    const companyId = req.headers["x-company-id"];
    const adminId = req.user.id;

    const db = await getTenantDB(companyId);
    await db.SheetIntegration.upsert({ adminId, companyId, sheetId });

    res.status(200).json({ success: true, message: "Sheet ID saved" });
  } catch (error) {
    console.error("❌ Error saving sheet ID:", error);
    res.status(500).json({ success: false, message: "Error saving sheet ID" });
  }
};

// ✅ 2. Import Client Leads
exports.importClientLeads = async (req, res) => {
  try {
    const companyId = req.headers["x-company-id"];
    const db = await getTenantDB(companyId);

    const integration = await db.SheetIntegration.findOne({ where: { companyId } });
    if (!integration || !integration.sheetId) {
      return res.status(400).json({ message: "No sheet ID found." });
    }

    const sheetId = integration.sheetId;
    const oAuth2Client = getOAuthClient();

    // Fetch the stored token from DB or env (temporary fallback)
    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1",
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return res.status(400).json({ message: "Sheet has no data rows." });
    }

    const headers = rows[0].map(h => h.trim().toLowerCase());
    const allowedFields = [
      "name", "email", "phone", "education", "experience",
      "state", "country", "dob", "leadassigndate",
      "countrypreference", "assignedtoexecutive", "status"
    ];

    const validLeads = rows.slice(1).map(row => {
      const lead = {};
      headers.forEach((h, i) => {
        if (allowedFields.includes(h)) {
          lead[h] = row[i] || null;
        }
      });
      return lead;
    }).filter(lead => lead.name); // Only keep rows with 'name'

    const createdLeads = await db.ClientLead.bulkCreate(validLeads, { ignoreDuplicates: true });

    res.status(200).json({
      success: true,
      message: `${createdLeads.length} leads imported.`,
    });
  } catch (error) {
    console.error("❌ Error importing leads:", error);
    res.status(500).json({ success: false, message: "Import failed." });
  }
};

// ✅ 3. (Optional) OAuth redirect callback (for testing)
exports.handleOAuthCallback = async (req, res) => {
  const code = req.query.code;
  const oAuth2Client = getOAuthClient();

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("✅ Tokens received:", tokens);

    // You would normally store these tokens in DB per admin/companyId
    return res.status(200).send("OAuth flow complete. You can now close this tab.");
  } catch (error) {
    console.error("❌ OAuth callback failed:", error);
    res.status(500).send("OAuth callback error.");
  }
};
