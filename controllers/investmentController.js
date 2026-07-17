const Investment = require("../models/Investment");

// Create Investment
exports.createInvestment = async (req, res) => {
  try {
    const investment = await Investment.create({
      ...req.body,
      agentId: req.agent.id, // Logged-in Agent ID
    });

    res.status(201).json({
      success: true,
      message: "Investment Added Successfully",
      investment,
    });
  } catch (err) {
    res.status(500).json({
     
      
      success: false,
      message: err.message,
    });
    console.log(err)
  }
};

// Get All Investments of Logged-in Agent
exports.getInvestments = async (req, res) => {
  try {
    const data = await Investment.find({
      agentId: req.agent.id,
    })
      .populate("clientId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Investment
exports.getInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      agentId: req.agent.id,
    }).populate("clientId");

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment Not Found",
      });
    }

    res.json({
      success: true,
      investment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Investment
exports.updateInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOneAndUpdate(
      {
        _id: req.params.id,
        agentId: req.agent.id,
      },
      req.body,
      { new: true }
    );

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment Not Found",
      });
    }

    res.json({
      success: true,
      message: "Investment Updated",
      investment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Investment
exports.deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      agentId: req.agent.id,
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment Not Found",
      });
    }

    res.json({
      success: true,
      message: "Investment Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Client Wise Investments
exports.getClientInvestments = async (req, res) => {
  try {
    const data = await Investment.find({
      clientId: req.params.clientId,
      agentId: req.agent.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Logged-in Agent Investments
exports.getMyInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({
      agentId: req.agent.id,
    })
      .populate("clientId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: investments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Upcoming Premiums
exports.upcomingPremiums = async (req, res) => {
  try {
    const today = new Date();

    const seven = new Date();
    seven.setDate(today.getDate() + 7);

    const data = await Investment.find({
      agentId: req.agent.id,
      status: "Active",
      nextPremiumDate: {
        $gte: today,
        $lte: seven,
      },
    }).populate("clientId");

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};