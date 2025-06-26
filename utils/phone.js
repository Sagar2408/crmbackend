// utils/phone.js
// ------------------------------------------------------------
//  Robust phone-number normaliser for Excel / CSV inputs.
//  Handles numeric, scientific notation, strings, intl formats.
// ------------------------------------------------------------
const { parsePhoneNumberFromString } = require("libphonenumber-js");

// helper: "9.31E+09" → "9310000000"
const sciToDigits = (s) => {
  const [coeff, expStr] = s.toLowerCase().split("e");
  let exp = parseInt(expStr.replace("+", ""), 10);
  let digits = coeff.replace(".", "");
  const dot = coeff.indexOf(".");
  if (dot !== -1) exp -= (coeff.length - dot - 1);
  while (exp-- > 0) digits += "0";
  return digits;
};

/**
 *  @param {*} rawVal          Value from Excel/CSV parser
 *  @param {string} defCtry    Default ISO country (e.g. "IN")
 *  @returns {string}          Clean E.164 / digit-string, or ""
 */
const sanitisePhone = (rawVal, defCtry = "IN") => {
  // 1️⃣ unwrap xlsx cell object
  let val = rawVal;
  if (val && typeof val === "object") {
    if (val.v !== undefined) val = val.v;
    else if (val.w !== undefined) val = val.w;
  }

  // 2️⃣ numeric → BigInt string (lossless)
  if (typeof val === "number") {
    val = BigInt(Math.round(val)).toString();
  }

  // 3️⃣ string handling
  if (typeof val === "string") {
    let s = val.trim().replace(/\s+/g, "");

    // scientific notation in string
    if (/^\d+(\.\d+)?e\+?\d+$/i.test(s)) {
      s = sciToDigits(s);
    }

    // keep leading +, drop other non-digits
    if (s.startsWith("+")) {
      s = "+" + s.slice(1).replace(/\D/g, "");
    } else {
      s = s.replace(/\D/g, "");
    }

    // 4️⃣ libphonenumber validation
    const parsed = s && parsePhoneNumberFromString(s, defCtry.toUpperCase());
    if (parsed && parsed.isValid()) return parsed.number;   // E.164

    // 5️⃣ fallback - return digits so data not lost
    return s || "";
  }

  return "";
};

module.exports = { sanitisePhone };
