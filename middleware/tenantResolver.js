const { getTenantDB } = require("../config/sequelizeManager");

const skipTenantPaths = ["/api/masteruser/login", "/api/masteruser/signup"];

/**
 * Utility: Extract and clean companyId from req
 */
function extractCompanyId(req) {
  const sources = [
    req.body?.companyId,
    req.query?.companyId,
    req.headers["x-company-id"],
  ];
  for (let id of sources) {
    if (typeof id === "string") {
      return id.trim().replace(/[^a-z0-9\-]/gi, "");
    }
  }
  return null;
}

module.exports = async (req, res, next) => {
  // ⏭️ Skip middleware for master-level endpoints
  if (skipTenantPaths.some((path) => req.originalUrl.startsWith(path))) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`🏁 [TENANT] Skipping tenantResolver for ${req.originalUrl}`);
    }
    return next();
  }

  try {
    // 🔍 Extract and clean companyId
    const companyId = extractCompanyId(req);

    if (process.env.NODE_ENV !== "production") {
      console.log("📦 Raw companyId resolved from request:", companyId);
    }

    if (!companyId) {
      console.warn("⚠️ [TENANT] Missing or invalid companyId");
      return res.status(400).json({ message: "Missing or invalid companyId" });
    }

    // 🔌 Connect to tenant DB
    const tenantDB = await getTenantDB(companyId);

    if (!tenantDB) {
      console.error(
        "❌ [TENANT] No DB returned from getTenantDB for:",
        companyId
      );
      return res
        .status(404)
        .json({ message: "Invalid companyId or tenant DB not configured" });
    }

    // 💾 Attach DB and companyId to request
    req.db = tenantDB;
    req.companyId = companyId;

    console.log(`✅ [TENANT] Tenant DB resolved for companyId: ${companyId}`);

    console.log('✅ [TENANT] DB resolved and models:', Object.keys(tenantDB));

    return next();
  } catch (err) {
    console.error("❌ [TENANT] Error resolving tenant:", err.message || err);
    if (process.env.NODE_ENV !== "production") {
      console.error("📋 Stack trace:", err);
    }
    return res
      .status(500)
      .json({ message: "Error resolving tenant", error: err.message });
  }
};
