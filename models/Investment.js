const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  company: { type: String, required: true },
  policyNumber: String,
  premium: Number,
  dueDate: Date,
  frequency: {
    type: String,
    enum: ["Monthly", "Yearly"],
    default: "Yearly"
  },
  status: {
    type: String,
    default: "Due"
  },
  lastReminder: Date,
  lastPaidDate: Date
});

module.exports = mongoose.model("Investment", investmentSchema);