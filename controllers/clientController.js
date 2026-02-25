const Client = require("../models/Client");

// Create Client
exports.createClient = async (req, res) => {
  try {
    const client = await Client.create({
      ...req.body,
      agentId: req.agent.id
    });
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Clients (for logged-in agent)
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({
      agentId: req.agent.id
    });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};