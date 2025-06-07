const express = require("express");
const router = express.Router();
const rolePermissionController = require("../controllers/RolePermission.controller");

router.post("/create", rolePermissionController.createRolePermission);

// Toggle a specific permission for a RolePermission record
router.patch("/:id/toggle", rolePermissionController.togglePermission);

// Get all role permission records
router.get("/role-permissions", rolePermissionController.getAllRolePermissions);

//Get all the manager and users as one
router.get(
  "/get-managers-users",
  rolePermissionController.getAllUsersAndManagers
);

//get single permission by id
router.get("/permission/:id", rolePermissionController.getPermissionById);

//get single permission by id and role
router.get("/:role/:id", rolePermissionController.getPermissionByRoleAndId);

module.exports = router;
