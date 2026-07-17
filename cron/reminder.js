const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Investment = require("../models/Investment");

// Create transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Every day at 9:00 AM
cron.schedule("0 9 * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const investments = await Investment.find({
      status: "Active",
    }).populate("clientId");

    for (const investment of investments) {
      if (!investment.nextPremiumDate) continue;

      const premiumDate = new Date(investment.nextPremiumDate);
      premiumDate.setHours(0, 0, 0, 0);

      const diff = Math.floor(
        (premiumDate - today) / (1000 * 60 * 60 * 24)
      );

      let subject = "";
      let message = "";

      // 7 days before
      if (diff === 7) {
        subject = "Premium Reminder - 7 Days Left";
      }

      // 1 day before
      else if (diff === 1) {
        subject = "Premium Reminder - Tomorrow";
      }

      // Today
      else if (diff === 0) {
        subject = "Premium Due Today";
      }

      // Overdue every 3 days
      else if (diff < 0 && Math.abs(diff) % 3 === 0) {
        subject = "Premium Overdue Reminder";
      } else {
        continue;
      }

      await transporter.sendMail({
        to: investment.clientId.email,
        subject,
        html: `
          <h2>Premium Reminder</h2>

          <p>Dear <b>${investment.clientId.name}</b>,</p>

          <p>Your premium details are:</p>

          <table border="1" cellpadding="8" cellspacing="0">
            <tr>
              <td><b>Company</b></td>
              <td>${investment.companyName}</td>
            </tr>
            <tr>
              <td><b>Policy No</b></td>
              <td>${investment.policyNumber}</td>
            </tr>
            <tr>
              <td><b>Premium Amount</b></td>
              <td>₹${investment.premiumAmount}</td>
            </tr>
            <tr>
              <td><b>Due Date</b></td>
              <td>${premiumDate.toLocaleDateString("en-IN")}</td>
            </tr>
          </table>

          <br>

          <p>Please pay your premium on time to keep your policy active.</p>

          <br>

          <p>Regards,</p>
          <b>Priyanka More</b>
        `,
      });

      investment.lastReminder = new Date();
      await investment.save();
    }

    console.log("Premium reminders checked.");
  } catch (err) {
    console.log(err);
  }
});