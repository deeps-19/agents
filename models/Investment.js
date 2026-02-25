const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true
    },

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true
    },

    company: {
      type: String,
      required: true
    },

    type: {
      type: String, // LIC / Post / Goshala / Mutual Fund
      required: true
    },

    accountNo: String,   // previously policyNumber
    receiptNo: String,

    premium: {
      type: Number,
      required: true
    },

    openingDate: Date,

    dueDate: {
      type: Date,
      required: true
    },

    frequency: {
      type: String,
      enum: ["Monthly", "Quarterly", "Half-Yearly", "Yearly"],
      default: "Yearly"
    },

    status: {
      type: String,
      enum: ["Due", "Paid"],
      default: "Due"
    },

    lastReminder: Date,
    lastPaidDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Investment", investmentSchema);