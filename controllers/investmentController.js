const Investment = require("../models/Investment");
const Client = require("../models/Client");

// Create Investment under a client
exports.createInvestment = async (req, res) => {
  try {
    const investment = await Investment.create({
      ...req.body,
      clientId: req.params.clientId,
      agentId: req.agent.id
    });

    res.status(201).json(investment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateInvestment = async (req, res) => {
  try {
    const { id } = req.params;

    const investment = await Investment.findById(id).populate("clientId");

    if (!investment)
      return res.status(404).json({ message: "Investment not found" });

    // Check if this investment belongs to logged-in agent
    if (investment.clientId.agentId.toString() !== req.agent.id)
      return res.status(403).json({ message: "Unauthorized" });

    const updated = await Investment.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteInvestment = async (req, res) => {
  try {
    const { id } = req.params;

    const investment = await Investment.findById(id).populate("clientId");

    if (!investment)
      return res.status(404).json({ message: "Investment not found" });

    // Security check
    if (investment.clientId.agentId.toString() !== req.agent.id)
      return res.status(403).json({ message: "Unauthorized" });

    await Investment.findByIdAndDelete(id);

    res.json({ message: "Investment deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get investments for a client
exports.getInvestments = async (req, res) => {
  try {
    const { clientId } = req.params;

    const investments = await Investment.find({ clientId });

    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const investment = await Investment.findById(id).populate("clientId");

    if (!investment)
      return res.status(404).json({ message: "Investment not found" });

    // Security check
    if (investment.clientId.agentId.toString() !== req.agent.id)
      return res.status(403).json({ message: "Unauthorized" });

    const today = new Date();

    // Calculate next due date
    let nextDueDate = new Date(investment.dueDate);

    if (investment.frequency === "Monthly") {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    } else if (investment.frequency === "Yearly") {
      nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
    }

    investment.lastPaidDate = today;
    investment.dueDate = nextDueDate;
    investment.status = "Due";
    investment.lastReminder = null;

    await investment.save();

    res.json({
      message: "Marked as paid. Next due date updated.",
      investment
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};