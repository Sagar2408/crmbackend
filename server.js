require("dotenv").config();
require("./cron/notificationCleaner");

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

const { getTenantDB } = require("./config/sequelizeManager");

const app = express();
const server = http.createServer(app);

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://crmfrontend-omega.vercel.app",
  "https://crm-frontend-atozeevisas.vercel.app",
  "https://crm-frontend-live.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// ✅ Apply CORS before routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const io = new Server(server, {
  cors: corsOptions,
});

// 🔐 Middlewares
const auth = require("./middleware/auth");
const authMaster = require("./middleware/authMaster");
const tenantResolver = require("./middleware/tenantResolver");

// 📦 Master Routes
app.use("/api/masteruser", require("./routes/MasterUser.routes"));
app.use("/api/company", require("./routes/Company.routes"));

// 📦 Tenant Routes
app.use("/api", tenantResolver, require("./routes/User.routes"));
app.use("/api/manager", tenantResolver, require("./routes/Manager.routes"));
app.use("/api/deals", auth(), tenantResolver, require("./routes/Deal.routes"));
app.use("/api/leads", auth(), tenantResolver, require("./routes/Lead.routes"));
app.use("/api/meetings", auth(), tenantResolver, require("./routes/Meeting.routes"));
app.use("/api/opportunities", auth(), tenantResolver, require("./routes/Opportunity.routes"));
app.use("/api/client-leads", auth(), tenantResolver, require("./routes/ClientLead.routes"));
app.use("/api/invoice", auth(), tenantResolver, require("./routes/Invoices.routes"));
app.use("/api", tenantResolver, require("./routes/Chatbot.routes"));
app.use("/api/executive-activities", auth(), tenantResolver, require("./routes/ExecutiveActivity.routes"));
app.use("/api/freshleads", auth(), tenantResolver, require("./routes/FreshLead.routes"));
app.use("/api/converted", auth(), tenantResolver, require("./routes/ConvertedClient.routes"));
app.use("/api/close-leads", auth(), tenantResolver, require("./routes/CloseLead.routes"));
app.use("/api/notification", auth(), tenantResolver, require("./routes/Notification.routes"));
app.use("/api/executive-dashboard", auth(), tenantResolver, require("./routes/Executivedashboard.routes"));
app.use("/api/settings", auth(), tenantResolver, require("./routes/Settings.routes"));
app.use("/api/followup", auth(), tenantResolver, require("./routes/Followup.routes"));
app.use("/api/followuphistory", auth(), tenantResolver, require("./routes/FollowUpHistory.routes"));
app.use("/api/processperson", tenantResolver, require("./routes/ProcessPerson.routes"));
app.use("/api/customer", tenantResolver, require("./routes/Customer.routes"));
app.use("/api/email", tenantResolver, require("./routes/Email.routes"));
app.use("/api/revenue", tenantResolver, require("./routes/RevenueChart.routes"));
app.use("/api/customer-details", auth(), tenantResolver, require("./routes/CustomerDetails.routes"));
app.use("/api/customer-stages", auth(), tenantResolver, require("./routes/CustomerStages.routes"));
app.use("/api/eod-report", tenantResolver, require("./routes/EodReport.routes"));

// 🧠 Track Connected Users
const connectedUsers = {};

io.on("connection", (socket) => {
  console.log("🟢 New socket connection:", socket.id);

  socket.on("set_user", async ({ userId, companyId }) => {
    if (!userId || !companyId) return;

    socket.userId = userId;
    socket.companyId = companyId;
    connectedUsers[userId] = socket.id;

    try {
      const tenantDB = await getTenantDB(companyId);
      await tenantDB.Users.update({ is_online: true }, { where: { id: userId } });
      io.emit("status_update", { userId, is_online: true });
    } catch (err) {
      console.error("⚠️ Error setting user online:", err);
    }
  });

  socket.on("disconnect", async () => {
    const { userId, companyId } = socket;
    if (userId && companyId) {
      delete connectedUsers[userId];
      try {
        const tenantDB = await getTenantDB(companyId);
        await tenantDB.Users.update({ is_online: false }, { where: { id: userId } });
        io.emit("status_update", { userId, is_online: false });
        console.log("🔴 User disconnected:", userId);
      } catch (err) {
        console.error("⚠️ Error setting user offline:", err);
      }
    }
  });
});

// 🔔 Notification Helper
const sendNotificationToUser = async (userId, companyId, notificationData) => {
  try {
    const socketId = connectedUsers[userId];
    const tenantDB = await getTenantDB(companyId);
    const notification = await tenantDB.Notification.create(notificationData);

    if (socketId) {
      io.to(socketId).emit("new_notification", notification);
    } else {
      console.log(`⚠️ User ${userId} not connected`);
    }
  } catch (err) {
    console.error("❌ Error sending notification:", err);
  }
};

module.exports = {
  app,
  sendNotificationToUser,
};

// 🚀 Start Server
if (process.env.NODE_ENV !== "test") {
  server.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
  });
}