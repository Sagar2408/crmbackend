// utils/googleSheetsReader.js
const { google } = require("googleapis");

async function readSheetData(sheetId, auth) {
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1", // or dynamically detected
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0].map(h => h.trim().toLowerCase());
  const validFields = [
    "name", "email", "phone", "education", "experience",
    "state", "country", "dob", "leadassigndate",
    "countrypreference", "assignedtoexecutive", "status"
  ];

  const data = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, idx) => {
      if (validFields.includes(h)) {
        obj[h] = row[idx];
      }
    });
    return obj;
  });

  return data;
}

module.exports = { readSheetData };
