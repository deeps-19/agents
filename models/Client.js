const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true
  },
  name: { type: String, required: true },
  email: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Client", clientSchema);