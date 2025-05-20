// routes/User.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/User.controller");
const auth = require("../middleware/auth");

// Public routes
router.post("/signup", userController.signupLocal);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/logout", auth(), userController.logout);

// Role-specific protected routes
router.get("/admin", auth(["Admin"]), userController.getAdminDashboard);
router.get("/tl", auth(["TL"]), userController.getTLDashboard);
router.post(
  "/admin/toggle-login",
  auth(),
  userController.toggleUserLoginAccess
);
router.get(
  "/executive",
  auth(["Executive"]),
  userController.getExecutiveDashboard
);

// General profile route
router.get("/profile", auth(), userController.getUserProfile); // No role restriction

// New protected routes with proper authorization
router.get(
  "/executives",
  auth(["Admin", "TL"]), // Only Admin and TL can access
  userController.getAllExecutives
);
router.get(
  "/team-leads",
  auth(["Admin"]), // Only Admin can access
  userController.getAllTeamLeads
);
router.get(
  "/executives/:id", //For executive info popover
  auth(["Admin", "TL", "Executive"]),
  userController.getExecutiveById
);
router.get("/admin/profile", auth(["Admin"]), userController.getAdminById);
// Get online users (accessible to Admin and TL)
router.get(
  "/online",
  auth(["Admin", "TL"]),
  userController.getOnlineExecutives
);

module.exports = router;
