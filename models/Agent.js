const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Agent", agentSchema);