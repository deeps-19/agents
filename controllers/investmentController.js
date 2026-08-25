const Investment = require("../models/Investment");
const Client = require("../models/Client");

// ==============================
// CREATE INVESTMENT
// ==============================
exports.createInvestment = async (req, res) => {
  try {
    const {
      clientId,
      investmentType,
      policyNumber,
    } = req.body;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    if (!investmentType) {
      return res.status(400).json({
        success: false,
        message: "Investment type is required",
      });
    }

    // Check duplicate LIC policy number
    if (investmentType === "LIC" && policyNumber) {
      const existingPolicy = await Investment.findOne({
        policyNumber: policyNumber.trim(),
      });

      if (existingPolicy) {
        return res.status(409).json({
          success: false,
          message: `LIC policy number ${policyNumber} already exists.`,
        });
      }
    }

    const investment = await Investment.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Investment created successfully",
      data: investment,
    });

  } catch (error) {
    console.error("Create Investment Error:", error);

    // Handle MongoDB duplicate key as well
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This policy number already exists.",
        field: Object.keys(error.keyPattern || {})[0],
        value: Object.values(error.keyValue || {})[0],
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create investment",
      error: error.message,
    });
  }
};


// ==============================
// GET SINGLE INVESTMENT
// ==============================
exports.getInvestment = async (req, res) => {
  try {
    const investment = await Investment
      .findById(req.params.id)
      .populate("clientId");

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: investment,
    });

  } catch (error) {
    console.error("Get Investment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get investment",
      error: error.message,
    });
  }
};


// ==============================
// UPDATE INVESTMENT
// ==============================
exports.updateInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(
      req.params.id
    );

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    Object.assign(investment, req.body);

    await investment.save();

    return res.status(200).json({
      success: true,
      message: "Investment updated successfully",
      data: investment,
    });

  } catch (error) {
    console.error("Update Investment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update investment",
      error: error.message,
    });
  }
};


// ==============================
// GET CLIENT INVESTMENTS
// ==============================
exports.getClientInvestments = async (req, res) => {
  try {
    const investments = await Investment
      .find({
        clientId: req.params.clientId,
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: investments.length,
      data: investments,
    });

  } catch (error) {
    console.error("Get Client Investments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get investments",
      error: error.message,
    });
  }
};


// ==============================
// DELETE INVESTMENT
// ==============================
exports.deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findByIdAndDelete(
      req.params.id
    );

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Investment deleted successfully",
    });

  } catch (error) {
    console.error("Delete Investment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete investment",
      error: error.message,
    });
  }
};