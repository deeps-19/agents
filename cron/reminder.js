const cron = require("node-cron");
const Investment = require("../models/Investment");
const Client = require("../models/Client");
const nodemailer = require("nodemailer");

cron.schedule("0 9 * * *", async () => {

  const today = new Date();
  today.setHours(0,0,0,0);

  const investments = await Investment.find({ status: "Due" })
    .populate({
      path: "clientId",
      populate: { path: "agentId" }
    });

  for (let inv of investments) {

    const dueDate = new Date(inv.dueDate);
    dueDate.setHours(0,0,0,0);

    const diff = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

    let shouldSend = false;

    // 7 days before
    if (diff === -7) shouldSend = true;

    // 1 day before
    if (diff === -1) shouldSend = true;

    // Due today
    if (diff === 0) shouldSend = true;

    // Overdue every 3 days
    if (diff > 0 && diff % 3 === 0) shouldSend = true;

    if (!shouldSend) continue;

    if (inv.lastReminder) {
      const last = new Date(inv.lastReminder);
      last.setHours(0,0,0,0);
      if (last.getTime() === today.getTime())
        continue;
    }

    // SEND EMAIL
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: inv.clientId.email,
      subject: "Premium Reminder",
      text: `Dear ${inv.clientId.name}, your ${inv.company} premium of ₹${inv.premium} is pending.`
    });

    inv.lastReminder = today;
    await inv.save();
  }

});