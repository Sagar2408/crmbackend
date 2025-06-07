const moment = require("moment-timezone");
const { Company } = require("../config/masterSequelize");
const { getTenantDB } = require("../config/sequelizeManager");
const { sendNotificationToUser } = require("../utils/notificationHelper");

async function notifyUpcomingMeetings() {
  const nowUTC = moment.utc();
  const targetTimeUTC = nowUTC.clone().add(2, "minutes");
  const windowStart = targetTimeUTC.clone().subtract(30, "seconds").toDate();
  const windowEnd = targetTimeUTC.clone().add(30, "seconds").toDate();

  console.log(`\n🔔 [NOTIFIER START]`);
  console.log(`🕒 UTC Now: ${nowUTC.format()}`);
  console.log(`🕒 IST Now: ${nowUTC.clone().tz("Asia/Kolkata").format("YYYY-MM-DD hh:mm:ss A")}`);
  console.log(`📆 Query window (UTC): ${windowStart.toISOString()} - ${windowEnd.toISOString()}`);

  const companies = await Company.findAll();
  console.log(`🏢 Found ${companies.length} companies`);

  for (const company of companies) {
    console.log(`\n🔍 Processing company: ${company.name} [ID: ${company.id}]`);
    try {
      const db = await getTenantDB(company.id);
      const { Meeting, Notification } = db;

      const meetings = await Meeting.findAll({
        where: {
          startTime: {
            [db.Sequelize.Op.between]: [windowStart, windowEnd],
          },
          notified: false,
        },
      });

      console.log(`📅 Found ${meetings.length} meetings to notify`);

      if (meetings.length === 0) {
        console.log(`⛔ No upcoming meetings found for window`);
        continue;
      }

      for (const meeting of meetings) {
        const startTimeIST = moment(meeting.startTime)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD hh:mm A");

        const message = `⏰ Reminder: Meeting with ${meeting.clientName} at ${startTimeIST}`;

        console.log(
          `📨 Sending notification to executiveId=${meeting.executiveId}, startTime=${startTimeIST}`
        );

        // Save to DB
        const notification = await Notification.create({
          userId: meeting.executiveId,
          message,
          targetRole: "executive",
        });

        // Send real-time
        await sendNotificationToUser(meeting.executiveId, company.id, {
          ...notification.toJSON(),
        });

        // Update flag
        meeting.notified = true;
        await meeting.save();

        console.log(`✅ Notification saved and sent to executive ${meeting.executiveId}`);
      }
    } catch (err) {
      console.error(`❌ [ERROR: ${company.name}]`, err);
    }
  }

  console.log(`✅ [NOTIFIER END]`);
}

module.exports = notifyUpcomingMeetings;
