const db = require("../config/sequelize"); // Adjust the path to your DB if different
const { Op } = require("sequelize");

exports.createRolePermission = async (req, res) => {
  const RolePermission = req.db.RolePermission;
  const { Op } = require("sequelize");
  const { v4: uuidv4 } = require("uuid");

  try {
    const { manager_id, user_id, role } = req.body;

    const allowedRoles = ["Manager", "TL", "HR"];

    // Validate role
    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        message: `Invalid role provided. Allowed roles are: ${allowedRoles.join(
          ", "
        )}`,
      });
    }

    // Determine which ID is sent
    const isManager = !!manager_id;
    const idField = isManager ? "manager_id" : "user_id";
    const idValue = isManager ? manager_id : user_id;

    if (!idValue) {
      return res
        .status(400)
        .json({ message: "Either manager_id or user_id must be provided." });
    }

    // Check for duplicate RolePermission
    const existing = await RolePermission.findOne({
      where: {
        [idField]: idValue,
        role,
      },
    });

    if (existing) {
      return res.status(409).json({
        message: `RolePermission for ${idField} ${idValue} with role '${role}' already exists.`,
      });
    }

    // Create the new RolePermission
    const payload = {
      id: uuidv4(),
      role,
      overview: false,
      assign_task: false,
      task_management: false,
      monitoring: false,
      executive_details: false,
      invoice: false,
      dashboard: false,
      user_management: false,
      reporting: false,
      settings: false,
      billing: false,
      weekly_summary: false,
      account_updates: false,
      marketing_emails: false,
      push_notifications: false,
      sms_notifications: false,
      email_notifications: false,
    };

    payload[idField] = idValue;

    const newPermission = await RolePermission.create(payload);

    res.status(201).json({
      message: "RolePermission created successfully.",
      record: newPermission,
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.togglePermission = async (req, res) => {
  const RolePermission = req.db.RolePermission;
  try {
    const { id } = req.params; // RolePermission record ID
    const { permissionKey } = req.body; // permission column name like "dashboard"

    // Ensure the permissionKey is valid
    const validPermissions = [
      "overview",
      "assign_task",
      "task_management",
      "monitoring",
      "executive_details",
      "invoice",
      "dashboard",
      "user_management",
      "reporting",
      "settings",
      "billing",
      "weekly_summary",
      "account_updates",
      "marketing_emails",
      "push_notifications",
      "sms_notifications",
      "email_notifications",
    ];

    if (!validPermissions.includes(permissionKey)) {
      return res.status(400).json({ message: "Invalid permission key." });
    }

    // Fetch existing RolePermission record
    const record = await RolePermission.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: "Permission record not found." });
    }

    // Toggle the permission
    record[permissionKey] = !record[permissionKey];
    await record.save();

    res.status(200).json({
      message: `Permission '${permissionKey}' toggled successfully.`,
      updatedRecord: record,
    });
  } catch (error) {
    console.error("Toggle error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getAllRolePermissions = async (req, res) => {
  const RolePermission = req.db.RolePermission;

  try {
    const permissions = await RolePermission.findAll({
      attributes: ["id", "role", "manager_id", "user_id"],
    });

    const formatted = permissions.map((p) => ({
      id: p.id,
      label: `Role: ${p.role} | ${
        p.manager_id ? "Manager ID: " + p.manager_id : "User ID: " + p.user_id
      }`,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//fetching permission only by id
exports.getPermissionById = async (req, res) => {
  try {
    const userId = req.params.id;
    const RolePermission = req.db.RolePermission;
    const permission = await RolePermission.findOne({
      where: { id: userId },
    });

    if (!permission) {
      return res.status(404).json({ message: "Permission not found." });
    }
    res.status(200).json({ permission });
  } catch (error) {
    console.error("Error fetching Permissions:", error);
    res.status(500).json({ message: "Server error." });
  }
};

//fetching permission with id and
exports.getPermissionByRoleAndId = async (req, res) => {
  const { role, id } = req.params;
  const RolePermission = req.db.RolePermission;

  try {
    let condition = {};

    // Determine the correct field based on role
    if (role === "Manager") {
      condition = { role, manager_id: id };
    } else if (role === "TL" || role === "HR") {
      condition = { role, user_id: id };
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const permission = await RolePermission.findOne({
      where: condition,
    });

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    res.status(200).json(permission);
  } catch (error) {
    console.error("Error fetching permission:", error);
    res.status(500).json({ message: "Server error while fetching permission" });
  }
};

exports.getAllUsersAndManagers = async (req, res) => {
  const User = req.db.Users;
  const Manager = req.db.Manager;

  try {
    // Fetch users with their roles
    const users = await User.findAll({
      attributes: ["id", "role"],
      where: {
        role: {
          [Op.notIn]: ["Admin", "Executive"],
        },
      },
    });

    // Fetch managers (role = Manager)
    const managers = await Manager.findAll({
      attributes: ["id"],
    });

    // Format users: "Executive - id - 2", "TL - id - 5", etc.
    const userOptions = users.map((user) => ({
      id: user.id,
      label: `id - ${user.id} - ${user.role}`,
    }));

    // Format managers: "Manager - id - 2"
    const managerOptions = managers.map((manager) => ({
      id: manager.id,
      label: `id - ${manager.id} - Manager`,
    }));

    // Combine both lists
    const combinedOptions = [...userOptions, ...managerOptions];

    res.status(200).json(combinedOptions);
  } catch (error) {
    console.error("Error generating dropdown options:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
